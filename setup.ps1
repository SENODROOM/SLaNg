#Requires -Version 5.1
# setup.ps1 -- Intelligent submodule-aware repo setup
# Reads all submodules from .gitmodules; no hardcoded repo names.
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------
#  Logging
# ---------------------------------------------
function Write-Banner {
    Clear-Host
    Write-Host ""
    Write-Host "  +----------------------------------------------+" -ForegroundColor DarkCyan
    Write-Host "  |      Repo Setup  --  Submodule-Aware         |" -ForegroundColor DarkCyan
    Write-Host "  +----------------------------------------------+" -ForegroundColor DarkCyan
    Write-Host ""
}

function Write-Section {
    param([string]$Title)
    Write-Host ""
    $pad = "-" * [Math]::Max(2, 40 - $Title.Length)
    Write-Host "  -- $Title $pad" -ForegroundColor DarkCyan
}

function Write-Info {
    param([string]$Msg)
    Write-Host "  " -NoNewline
    Write-Host "->  " -ForegroundColor DarkCyan -NoNewline
    Write-Host $Msg -ForegroundColor Gray
}

function Write-Ok {
    param([string]$Msg)
    Write-Host "  " -NoNewline
    Write-Host "[OK]  " -ForegroundColor Green -NoNewline
    Write-Host $Msg -ForegroundColor White
}

function Write-Skip {
    param([string]$Msg)
    Write-Host "  " -NoNewline
    Write-Host "[--]  " -ForegroundColor Yellow -NoNewline
    Write-Host "$Msg (skipped -- already done)" -ForegroundColor DarkGray
}

function Write-Fail {
    param([string]$Msg)
    Write-Host ""
    Write-Host "  [!!]  $Msg" -ForegroundColor Red
    Write-Host ""
}

function Invoke-Die {
    param([string]$Msg)
    Write-Fail $Msg
    exit 1
}

function Write-SummaryRow {
    param([string]$Label, [string]$Value)
    Write-Host "    " -NoNewline
    Write-Host $Label -ForegroundColor Cyan -NoNewline
    Write-Host "  $Value" -ForegroundColor Gray
}

function Write-CompletionBox {
    param([string]$Title)
    Write-Host ""
    Write-Host "  +----------------------------------------------+" -ForegroundColor Green
    Write-Host "  |  $($Title.PadRight(44))|" -ForegroundColor Green
    Write-Host "  +----------------------------------------------+" -ForegroundColor Green
    Write-Host ""
}

# ---------------------------------------------
#  Prerequisites
# ---------------------------------------------
function Require-Command {
    param([string]$Cmd)
    if (-not (Get-Command $Cmd -ErrorAction SilentlyContinue)) {
        Invoke-Die "'$Cmd' is not installed or not in PATH. Install it and retry."
    }
}

# ---------------------------------------------
#  .gitmodules parser
#  Returns array of PSCustomObject { Path; Url; Org; RepoName; State }
# ---------------------------------------------
function Read-GitModules {
    $file = ".gitmodules"
    if (-not (Test-Path $file)) {
        Invoke-Die ".gitmodules not found in $(Get-Location). Run this script from the project root."
    }

    $submodules = @()
    $path = $null
    $url = $null

    foreach ($line in Get-Content $file) {
        $line = $line.Trim()
        if ($line -match '^path\s*=\s*(.+)$') { $path = $Matches[1].Trim() }
        if ($line -match '^url\s*=\s*(.+)$') { $url = $Matches[1].Trim() }

        if ($path -and $url) {
            $clean = $url -replace '\.git$', ''
            $clean = $clean -replace '^.*github\.com[:/]', ''
            $org = $clean.Split('/')[0]
            $repoName = $clean.Split('/')[1]

            $submodules += [PSCustomObject]@{
                Path     = $path
                Url      = $url
                Org      = $org
                RepoName = $repoName
                State    = ""
            }
            $path = $null
            $url = $null
        }
    }

    if ($submodules.Count -eq 0) {
        Invoke-Die "No submodules found in .gitmodules."
    }
    return $submodules
}

# ---------------------------------------------
#  Safe git remote URL reader.
#  Native exe stderr cannot be suppressed with 2>$null in PS5;
#  merge streams with 2>&1 and filter out error lines instead.
# ---------------------------------------------
function Get-RemoteUrl {
    param([string]$Dir, [string]$Remote)
    # Locally silence errors so NativeCommandError from git.exe does not surface
    $local:ErrorActionPreference = "SilentlyContinue"
    try {
        $result = & git -C $Dir remote get-url $Remote 2>&1
    }
    catch {
        return ""
    }
    if ($LASTEXITCODE -ne 0) { return "" }
    $url = $result | Where-Object { $_ -is [string] -and $_ -notmatch "^error:" } | Select-Object -First 1
    if ($null -eq $url) { return "" }
    return $url.Trim()
}

# ---------------------------------------------
#  State detection
#  Returns: pristine | initialised | has_origin | fully_setup
# ---------------------------------------------
function Get-SubmoduleState {
    param([string]$Dir)

    if (-not (Test-Path "$Dir\.git" -PathType Container)) { return "pristine" }

    $hasOrigin = (Get-RemoteUrl -Dir $Dir -Remote "origin") -ne ""
    $hasUpstream = (Get-RemoteUrl -Dir $Dir -Remote "upstream") -ne ""

    if ($hasOrigin -and $hasUpstream) { return "fully_setup" }
    elseif ($hasOrigin) { return "has_origin" }
    else { return "initialised" }
}

# ---------------------------------------------
#  Git helpers
# ---------------------------------------------
function Ensure-GitInit {
    param([string]$Dir)
    if (-not (Test-Path "$Dir\.git" -PathType Container)) {
        # Suppress NativeCommandError: merge stderr into stdout before piping,
        # and silence errors locally so PS5 does not raise on non-zero-looking
        # informational messages written to stderr by git.exe.
        $local:ErrorActionPreference = "SilentlyContinue"

        Write-Info "Initialising git repo in '$Dir'..."
        $initOut = & git -C $Dir init -q 2>&1
        if ($LASTEXITCODE -ne 0) { Invoke-Die "git init failed in '$Dir':$([Environment]::NewLine)$($initOut -join [Environment]::NewLine)" }

        # `git checkout -b main` prints "Switched to a new branch 'main'" on
        # stderr (informational, not an error).  Merging streams suppresses the
        # NativeCommandError that PS5 would otherwise raise.
        # The `|| true` equivalent: we ignore a non-zero exit here because the
        # only failure case is "branch already exists", which is harmless.
        & git -C $Dir checkout -b main 2>&1 | Out-Null

        Write-Ok "Git initialised in '$Dir'"
    }
}

function Set-GitRemote {
    param([string]$Dir, [string]$Name, [string]$Url)
    $current = Get-RemoteUrl -Dir $Dir -Remote $Name
    if ($current -eq "") {
        & git -C $Dir remote add $Name $Url 2>&1 | Out-Null
    }
    elseif ($current -ne $Url) {
        & git -C $Dir remote set-url $Name $Url 2>&1 | Out-Null
    }
}

function Invoke-Pull {
    param([string]$Dir, [string]$Remote, [string]$Branch = "main")
    # Git writes fetch progress ("From https://...") to stderr even on success.
    # Scoping ErrorActionPreference prevents PS5 from raising NativeCommandError
    # on that informational output, while 2>&1 still captures everything so we
    # can surface a useful message if the pull genuinely fails.
    $local:ErrorActionPreference = "SilentlyContinue"
    $output = & git -C $Dir pull $Remote $Branch 2>&1
    if ($LASTEXITCODE -ne 0) {
        Invoke-Die "Pull failed in '$Dir':`n$($output -join "`n")`nResolve conflicts and retry."
    }
    Write-Ok "Pulled '$Branch' in $Dir"
}

function Get-CommitCount {
    param([string]$Dir)
    $local:ErrorActionPreference = "SilentlyContinue"
    try {
        $result = & git -C $Dir rev-list --count HEAD 2>&1
    }
    catch {
        return 0
    }
    if ($LASTEXITCODE -ne 0) { return 0 }
    $n = $result | Where-Object { $_ -match '^\d+$' } | Select-Object -First 1
    if ($null -eq $n) { return 0 }
    return [int]$n
}

# ---------------------------------------------
#  GitHub API helpers
# ---------------------------------------------
function Test-ForkExists {
    param([string]$Username, [string]$RepoName)
    try {
        $r = Invoke-WebRequest -Uri "https://github.com/$Username/$RepoName" `
            -UseBasicParsing -ErrorAction Stop
        return $r.StatusCode -eq 200
    }
    catch {
        return $false
    }
}

function Invoke-AutoFork {
    param([string]$Org, [string]$RepoName, [string]$Username, [string]$Token)
    Write-Info "Forking $Org/$RepoName -> $Username/$RepoName ..."
    $headers = @{
        "Authorization" = "token $Token"
        "Accept"        = "application/vnd.github+json"
    }
    try {
        $r = Invoke-WebRequest `
            -Uri             "https://api.github.com/repos/$Org/$RepoName/forks" `
            -Method          POST `
            -Headers         $headers `
            -UseBasicParsing `
            -ErrorAction     Stop
        if ($r.StatusCode -eq 202) { Write-Ok "Fork of '$RepoName' queued on GitHub" }
    }
    catch {
        $code = $_.Exception.Response.StatusCode.value__
        switch ($code) {
            401 { Invoke-Die "GitHub token rejected (401). Ensure the token is valid." }
            403 { Invoke-Die "GitHub API forbidden (403). Token needs 'repo' or 'public_repo' scope." }
            404 { Invoke-Die "Repository '$Org/$RepoName' not found (404). Check .gitmodules URLs." }
            422 { Write-Info "Fork of '$RepoName' already exists -- skipping creation." }
            default { Invoke-Die "GitHub API returned HTTP $code for '$RepoName'." }
        }
    }
}

# ---------------------------------------------
#  Input helpers
# ---------------------------------------------
function Read-NonEmpty {
    param([string]$Prompt)
    do {
        $v = (Read-Host "  $Prompt").Trim()
        if ([string]::IsNullOrWhiteSpace($v)) { Write-Fail "Input cannot be empty." }
    } while ([string]::IsNullOrWhiteSpace($v))
    return $v
}

function Read-Secret {
    param([string]$Prompt)
    do {
        $secure = Read-Host "  $Prompt" -AsSecureString
        $v = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
            [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure))
        $v = $v.Trim()
        if ([string]::IsNullOrWhiteSpace($v)) { Write-Fail "Token cannot be empty." }
    } while ([string]::IsNullOrWhiteSpace($v))
    return $v
}

function Read-Choice {
    param([string]$Prompt, [string[]]$Valid)
    do {
        $v = (Read-Host "  $Prompt").Trim().ToLower()
        if ($v -notin $Valid) {
            Write-Fail "Invalid input '$v'. Enter one of: $($Valid -join ' / ')."
        }
    } while ($v -notin $Valid)
    return $v
}

# ---------------------------------------------
#  Main
# ---------------------------------------------
function Main {
    # -- Locate project root -------------------
    # Walk up from the script's own directory until .gitmodules is found,
    # then Set-Location there -- so the script works from any subdirectory.
    # Use the script's own directory; .gitmodules must be right there.
    $root = Split-Path -Parent $MyInvocation.ScriptName
    if (-not (Test-Path (Join-Path $root ".gitmodules"))) {
        Write-Fail "No .gitmodules found in the script's directory ($root)."
        Write-Host "  Place setup.ps1 in the same folder as .gitmodules and try again." -ForegroundColor Red
        exit 1
    }
    Set-Location $root

    Write-Banner

    # -- Prerequisites -------------------------
    Write-Section "Checking Prerequisites"
    Require-Command "git"
    Write-Ok "git   $(git --version)"

    # -- Parse .gitmodules --------------------
    Write-Section "Reading .gitmodules"
    $submodules = Read-GitModules
    foreach ($s in $submodules) {
        Write-Ok "Found submodule: $($s.Path)  ->  $($s.Url)"
    }

    # -- Detect existing state ----------------
    Write-Section "Detecting Existing State"
    $allFullySetup = $true

    foreach ($s in $submodules) {
        $state = Get-SubmoduleState -Dir $s.Path
        $s.State = $state

        switch ($state) {
            "pristine" { Write-Info "$($s.Path)  ->  not initialised yet" }
            "initialised" { Write-Info "$($s.Path)  ->  git init done, no remotes" }
            "has_origin" { Write-Info "$($s.Path)  ->  origin set, no upstream" }
            "fully_setup" { Write-Skip "$($s.Path)  ->  origin + upstream already configured" }
        }
        if ($state -ne "fully_setup") { $allFullySetup = $false }
    }

    if ($allFullySetup) {
        Write-Host ""
        Write-Ok "Everything is already set up. Nothing to do."
        Write-Host ""
        Write-Host "  To pull latest changes:" -ForegroundColor DarkGray
        foreach ($s in $submodules) {
            Write-Host "    git -C $($s.Path) pull origin main" -ForegroundColor Yellow
        }
        Write-Host ""
        exit 0
    }

    # -- Mode selection -----------------------
    Write-Section "Setup Mode"
    Write-Host "  How would you like to set up the repositories?" -ForegroundColor White
    Write-Host "    fork   -- personal copies under your GitHub account" -ForegroundColor DarkGray
    Write-Host "    clone  -- direct read from upstream org" -ForegroundColor DarkGray
    Write-Host ""
    $method = Read-Choice -Prompt "Enter choice (fork/clone)" -Valid @("fork", "clone")

    # ==========================================
    #  FORK path
    # ==========================================
    if ($method -eq "fork") {

        Write-Section "GitHub Account"
        $username = Read-NonEmpty -Prompt "GitHub username"

        Write-Section "Verifying / Creating Forks"
        $token = $null
        $tokenFetched = $false
        $anyForked = $false

        foreach ($s in $submodules) {
            if ($s.State -eq "fully_setup") {
                Write-Skip "$($s.RepoName) -- remotes intact"
                continue
            }

            if (Test-ForkExists -Username $username -RepoName $s.RepoName) {
                Write-Ok "github.com/$username/$($s.RepoName) exists"
            }
            else {
                Write-Info "github.com/$username/$($s.RepoName) not found -- forking..."
                if (-not $tokenFetched) {
                    Write-Host ""
                    $token = Read-Secret -Prompt "GitHub Personal Access Token (needs 'repo' scope)"
                    $tokenFetched = $true
                }
                Invoke-AutoFork -Org $s.Org -RepoName $s.RepoName -Username $username -Token $token
                $anyForked = $true
            }
        }

        if ($anyForked) {
            Write-Info "Waiting 10s for GitHub to provision fork(s)..."
            Start-Sleep -Seconds 10
        }

        Write-Section "Configuring Remotes and Pulling"

        foreach ($s in $submodules) {
            if ($s.State -eq "fully_setup") { Write-Skip $s.Path; continue }

            $upstreamUrl = "https://github.com/$($s.Org)/$($s.RepoName).git"
            $forkUrl = "https://github.com/$username/$($s.RepoName).git"

            if (-not (Test-Path $s.Path -PathType Container)) {
                New-Item -ItemType Directory -Path $s.Path | Out-Null
            }
            Ensure-GitInit -Dir $s.Path

            # origin
            $curOrigin = Get-RemoteUrl -Dir $s.Path -Remote "origin"
            if ($curOrigin -eq "") {
                Set-GitRemote -Dir $s.Path -Name "origin" -Url $forkUrl
                Write-Ok "$($s.Path)  [origin]   $forkUrl"
            }
            elseif ($curOrigin -eq $forkUrl) {
                Write-Skip "$($s.Path)  [origin]   already correct"
            }
            else {
                Set-GitRemote -Dir $s.Path -Name "origin" -Url $forkUrl
                Write-Ok "$($s.Path)  [origin]   updated -> $forkUrl"
            }

            # upstream
            $curUpstream = Get-RemoteUrl -Dir $s.Path -Remote "upstream"
            if ($curUpstream -eq "") {
                Set-GitRemote -Dir $s.Path -Name "upstream" -Url $upstreamUrl
                Write-Ok "$($s.Path)  [upstream] $upstreamUrl"
            }
            elseif ($curUpstream -eq $upstreamUrl) {
                Write-Skip "$($s.Path)  [upstream] already correct"
            }
            else {
                Set-GitRemote -Dir $s.Path -Name "upstream" -Url $upstreamUrl
                Write-Ok "$($s.Path)  [upstream] updated -> $upstreamUrl"
            }

            # Pull only if no commits yet
            if ((Get-CommitCount -Dir $s.Path) -eq 0) {
                Invoke-Pull -Dir $s.Path -Remote "origin"
            }
            else {
                Write-Skip "$($s.Path) -- already has commits, not pulling"
            }
        }

        Write-CompletionBox "Fork Setup Complete!                        "
        Write-Host "  Remotes per submodule:" -ForegroundColor DarkGray
        Write-SummaryRow "origin  " "-> github.com/$username/{repo}  (your fork)"
        Write-SummaryRow "upstream" "-> upstream org  (sync with: git pull upstream main)"
        Write-Host ""

        # ==========================================
        #  CLONE path
        # ==========================================
    }
    elseif ($method -eq "clone") {

        Write-Section "Configuring Remotes and Pulling"

        foreach ($s in $submodules) {
            $upstreamUrl = "https://github.com/$($s.Org)/$($s.RepoName).git"

            if ($s.State -eq "has_origin" -or $s.State -eq "fully_setup") {
                $cur = Get-RemoteUrl -Dir $s.Path -Remote "origin"
                if ($cur -eq $upstreamUrl) {
                    Write-Skip "$($s.Path) -- origin already correct"
                    continue
                }
            }

            if (-not (Test-Path $s.Path -PathType Container)) {
                New-Item -ItemType Directory -Path $s.Path | Out-Null
            }
            Ensure-GitInit -Dir $s.Path

            $curOrigin = Get-RemoteUrl -Dir $s.Path -Remote "origin"
            if ($curOrigin -eq "") {
                Set-GitRemote -Dir $s.Path -Name "origin" -Url $upstreamUrl
                Write-Ok "$($s.Path)  [origin] $upstreamUrl"
            }
            elseif ($curOrigin -eq $upstreamUrl) {
                Write-Skip "$($s.Path)  [origin] already correct"
            }
            else {
                Set-GitRemote -Dir $s.Path -Name "origin" -Url $upstreamUrl
                Write-Ok "$($s.Path)  [origin] updated -> $upstreamUrl"
            }

            if ((Get-CommitCount -Dir $s.Path) -eq 0) {
                Invoke-Pull -Dir $s.Path -Remote "origin"
            }
            else {
                Write-Skip "$($s.Path) -- already has commits, not pulling"
            }
        }

        Write-CompletionBox "Clone Setup Complete!                       "
        Write-Host "  Remotes per submodule:" -ForegroundColor DarkGray
        Write-SummaryRow "origin" "-> upstream org (source)"
        Write-Host ""
    }
}

Main