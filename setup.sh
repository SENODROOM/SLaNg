#!/usr/bin/env bash
# setup.sh — Intelligent submodule-aware repo setup
# Reads all submodules from .gitmodules; no hardcoded repo names.
set -euo pipefail

# ─────────────────────────────────────────────
#  Logging
# ─────────────────────────────────────────────
_c_reset="\033[0m"
_c_cyan="\033[1;36m"
_c_green="\033[1;32m"
_c_red="\033[1;31m"
_c_gray="\033[0;37m"
_c_yellow="\033[1;33m"
_c_white="\033[1;37m"
_c_dim="\033[2m"

banner() {
    clear
    echo -e "${_c_cyan}"
    echo "  ╔══════════════════════════════════════════════╗"
    echo "  ║         Repo Setup  —  Submodule-Aware       ║"
    echo "  ╚══════════════════════════════════════════════╝"
    echo -e "${_c_reset}"
}

section()  { echo -e "\n${_c_cyan}  ── $* ${_c_dim}$(printf '%.0s─' {1..30})${_c_reset}"; }
info()     { echo -e "  ${_c_cyan}→${_c_reset}  ${_c_gray}$*${_c_reset}"; }
success()  { echo -e "  ${_c_green}✔${_c_reset}  ${_c_white}$*${_c_reset}"; }
fail()     { echo -e "\n  ${_c_red}✖  $*${_c_reset}\n" >&2; }
die()      { fail "$*"; exit 1; }
skipped()  { echo -e "  ${_c_yellow}↷${_c_reset}  ${_c_dim}$* (skipped — already done)${_c_reset}"; }

summary_row() { echo -e "    ${_c_cyan}$1${_c_reset}  ${_c_gray}$2${_c_reset}"; }

# ─────────────────────────────────────────────
#  Prerequisites
# ─────────────────────────────────────────────
require() {
    command -v "$1" &>/dev/null \
        || die "'$1' is not installed or not in PATH. Install it and retry."
}

# ─────────────────────────────────────────────
#  .gitmodules parser
#  Outputs lines: "<path> <url>"
# ─────────────────────────────────────────────
parse_gitmodules() {
    local file="${1:-.gitmodules}"
    [[ -f "$file" ]] || die ".gitmodules not found at $file"

    local path="" url=""
    # Pipe through tr to strip \r before reading, handles CRLF .gitmodules on Windows
    while IFS= read -r line; do
        line="${line#"${line%%[![:space:]]*}"}"   # ltrim
        if [[ "$line" =~ ^path[[:space:]]*=[[:space:]]*(.*) ]]; then
            path="${BASH_REMATCH[1]}"
        elif [[ "$line" =~ ^url[[:space:]]*=[[:space:]]*(.*) ]]; then
            url="${BASH_REMATCH[1]}"
        fi
        if [[ -n "$path" && -n "$url" ]]; then
            echo "$path $url"
            path=""; url=""
        fi
    # Append a newline so the last line is always read (handles files with no trailing newline)
    done < <({ tr -d '\r' < "$file"; echo; })
}

# Extract GitHub owner/repo from a URL (https or ssh)
parse_github_repo() {
    local url="$1"
    # https://github.com/ORG/REPO.git  or  git@github.com:ORG/REPO.git
    url="${url%.git}"
    url="${url##*github.com[:/]}"
    echo "$url"   # returns "ORG/REPO"
}

# ─────────────────────────────────────────────
#  State detection for a single submodule dir
# ─────────────────────────────────────────────
detect_state() {
    # Returns one of: pristine | initialised | has_origin | has_upstream | fully_setup
    local dir="$1"

    [[ -d "$dir/.git" ]] || { echo "pristine"; return; }

    local has_origin has_upstream
    has_origin=$(git -C "$dir" remote get-url origin   2>/dev/null && echo yes || echo no)
    has_upstream=$(git -C "$dir" remote get-url upstream 2>/dev/null && echo yes || echo no)

    if   [[ "$has_origin" == "yes" && "$has_upstream" == "yes" ]]; then echo "fully_setup"
    elif [[ "$has_origin" == "yes" ]];                              then echo "has_origin"
    else                                                                 echo "initialised"
    fi
}

# ─────────────────────────────────────────────
#  Git helpers
# ─────────────────────────────────────────────
ensure_git_init() {
    local dir="$1"
    if [[ ! -d "$dir/.git" ]]; then
        info "Initialising git repo in '$dir'..."
        git -C "$dir" init -q
        git -C "$dir" checkout -b main &>/dev/null || true
        success "Git initialised in '$dir'"
    fi
}

set_remote() {
    local dir="$1" name="$2" url="$3"
    local current
    current=$(git -C "$dir" remote get-url "$name" 2>/dev/null || true)
    if [[ -z "$current" ]]; then
        git -C "$dir" remote add "$name" "$url" 2>/dev/null
    elif [[ "$current" != "$url" ]]; then
        git -C "$dir" remote set-url "$name" "$url" 2>/dev/null
    fi
}

pull_branch() {
    local dir="$1" remote="$2" branch="${3:-main}"
    local output
    output=$(git -C "$dir" pull "$remote" "$branch" 2>&1) \
        || die "Pull failed in '$dir':\n$output\nResolve any conflicts and retry."
    success "Pulled '$branch' in $dir"
}

# ─────────────────────────────────────────────
#  GitHub API helpers
# ─────────────────────────────────────────────
fork_exists() {
    local username="$1" repo_name="$2"
    local code
    code=$(curl -s -o /dev/null -w "%{http_code}" "https://github.com/$username/$repo_name")
    [[ "$code" == "200" ]]
}

auto_fork() {
    local org="$1" repo_name="$2" username="$3" token="$4"
    local code
    code=$(curl -s -o /tmp/_fork_resp.json -w "%{http_code}" \
        -X POST \
        -H "Authorization: token $token" \
        -H "Accept: application/vnd.github+json" \
        "https://api.github.com/repos/$org/$repo_name/forks")

    case "$code" in
        202) success "Fork of '$repo_name' queued on GitHub" ;;
        422) info    "Fork of '$repo_name' already exists — skipping" ;;
        401) die "GitHub token rejected (401). Ensure the token is valid." ;;
        403) die "GitHub API forbidden (403). Token needs 'repo' or 'public_repo' scope." ;;
        404) die "Repository '$org/$repo_name' not found (404). Verify names in .gitmodules." ;;
        *)   die "GitHub API returned HTTP $code for '$repo_name'. See /tmp/_fork_resp.json." ;;
    esac
}

# ─────────────────────────────────────────────
#  Input helpers
# ─────────────────────────────────────────────
read_nonempty() {
    local prompt="$1" value=""
    while [[ -z "$value" ]]; do
        read -rp "  $prompt: " value
        value="${value// /}"
        [[ -z "$value" ]] && fail "Input cannot be empty."
    done
    echo "$value"
}

read_secret() {
    local prompt="$1" value=""
    while [[ -z "$value" ]]; do
        read -rsp "  $prompt: " value
        echo
        value="${value// /}"
        [[ -z "$value" ]] && fail "Input cannot be empty."
    done
    echo "$value"
}

read_choice() {
    local prompt="$1" value=""
    shift
    local valid=("$@")
    while true; do
        read -rp "  $prompt: " value
        value="${value,,}"
        for v in "${valid[@]}"; do
            [[ "$value" == "$v" ]] && { echo "$value"; return; }
        done
        fail "Invalid input '$value'. Enter one of: ${valid[*]}"
    done
}

# ─────────────────────────────────────────────
#  Main
# ─────────────────────────────────────────────
main() {
    # ── Locate project root ───────────────────
    # Walk up from the script's own directory until .gitmodules is found,
    # then cd there — so the script works from any subdirectory.
    # cd to the directory the script lives in; .gitmodules must be right there.
    local root
    root="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    if [[ ! -f "$root/.gitmodules" ]]; then
        echo -e "\n  \033[1;31m✖  No .gitmodules found in the script's directory ($root).\033[0m"
        echo -e "  \033[1;31m     Place setup.sh in the same folder as .gitmodules and try again.\033[0m\n" >&2
        exit 1
    fi
    cd "$root"

    banner

    # ── Prerequisites ──────────────────────────
    section "Checking Prerequisites"
    require git
    require curl
    success "git   $(git --version)"
    success "curl  $(curl --version | head -1)"

    # ── Parse .gitmodules ─────────────────────
    section "Reading .gitmodules"
    declare -A SUB_PATH SUB_URL SUB_ORG SUB_REPONAME
    local sub_count=0

    while IFS=" " read -r path url; do
        local org_repo
        org_repo=$(parse_github_repo "$url")
        local org="${org_repo%%/*}"
        local repo_name="${org_repo##*/}"

        SUB_PATH[$sub_count]="$path"
        SUB_URL[$sub_count]="$url"
        SUB_ORG[$sub_count]="$org"
        SUB_REPONAME[$sub_count]="$repo_name"

        success "Found submodule: $path  →  $url"
        (( sub_count++ )) || true
    done < <(parse_gitmodules "$root/.gitmodules")

    [[ $sub_count -gt 0 ]] || die "No submodules found in .gitmodules."

    # ── Detect existing state ─────────────────
    section "Detecting Existing State"
    declare -A SUB_STATE
    local all_fully_setup=true

    for (( i=0; i<sub_count; i++ )); do
        local dir="${SUB_PATH[$i]}"
        local state
        state=$(detect_state "$dir")
        SUB_STATE[$i]="$state"

        case "$state" in
            pristine)     info    "$dir  →  not initialised yet" ;;
            initialised)  info    "$dir  →  git init done, no remotes" ;;
            has_origin)   info    "$dir  →  origin set, no upstream" ;;
            fully_setup)  skipped "$dir  →  origin + upstream already configured" ;;
        esac

        [[ "$state" == "fully_setup" ]] || all_fully_setup=false
    done

    if [[ "$all_fully_setup" == true ]]; then
        echo ""
        success "Everything is already set up. Nothing to do."

        echo ""
        echo -e "  ${_c_dim}To pull latest changes run:${_c_reset}"
        for (( i=0; i<sub_count; i++ )); do
            echo -e "    ${_c_yellow}git -C ${SUB_PATH[$i]} pull origin main${_c_reset}"
        done
        echo ""
        exit 0
    fi

    # ── Mode selection ────────────────────────
    section "Setup Mode"
    echo -e "  ${_c_white}How would you like to set up the repositories?${_c_reset}"
    echo -e "  ${_c_dim}  fork   — personal copies under your GitHub account${_c_reset}"
    echo -e "  ${_c_dim}  clone  — direct read from upstream org${_c_reset}"
    echo ""
    local method
    method=$(read_choice "Enter choice (fork/clone)" "fork" "clone")

    # ══════════════════════════════════════════
    #  FORK path
    # ══════════════════════════════════════════
    if [[ "$method" == "fork" ]]; then

        section "GitHub Account"
        local username
        username=$(read_nonempty "GitHub username")

        section "Verifying / Creating Forks"
        local token="" token_fetched=false

        for (( i=0; i<sub_count; i++ )); do
            local org="${SUB_ORG[$i]}"
            local repo_name="${SUB_REPONAME[$i]}"
            local state="${SUB_STATE[$i]}"

            # Already fully set up — skip entirely
            if [[ "$state" == "fully_setup" ]]; then
                skipped "$repo_name — remotes intact"
                continue
            fi

            # Check fork
            if fork_exists "$username" "$repo_name"; then
                success "github.com/$username/$repo_name exists"
            else
                info "github.com/$username/$repo_name not found — forking..."
                if [[ "$token_fetched" == false ]]; then
                    echo ""
                    token=$(read_secret "GitHub Personal Access Token (needs 'repo' scope)")
                    token_fetched=true
                fi
                auto_fork "$org" "$repo_name" "$username" "$token"
            fi
        done

        if [[ "$token_fetched" == true ]]; then
            info "Waiting 10s for GitHub to provision fork(s)..."
            sleep 10
        fi

        section "Configuring Remotes & Pulling"

        for (( i=0; i<sub_count; i++ )); do
            local dir="${SUB_PATH[$i]}"
            local org="${SUB_ORG[$i]}"
            local repo_name="${SUB_REPONAME[$i]}"
            local state="${SUB_STATE[$i]}"
            local upstream_url="https://github.com/$org/$repo_name.git"
            local fork_url="https://github.com/$username/$repo_name.git"

            [[ "$state" == "fully_setup" ]] && { skipped "$dir"; continue; }

            # Ensure git repo exists
            [[ -d "$dir" ]] || mkdir -p "$dir"
            ensure_git_init "$dir"

            # Set origin if missing / wrong
            local cur_origin
            cur_origin=$(git -C "$dir" remote get-url origin 2>/dev/null || true)
            if [[ -z "$cur_origin" ]]; then
                set_remote "$dir" "origin" "$fork_url"
                success "$dir  [origin]   $fork_url"
            elif [[ "$cur_origin" == "$fork_url" ]]; then
                skipped "$dir  [origin]   already correct"
            else
                set_remote "$dir" "origin" "$fork_url"
                success "$dir  [origin]   updated → $fork_url"
            fi

            # Set upstream if missing
            local cur_up
            cur_up=$(git -C "$dir" remote get-url upstream 2>/dev/null || true)
            if [[ -z "$cur_up" ]]; then
                set_remote "$dir" "upstream" "$upstream_url"
                success "$dir  [upstream] $upstream_url"
            elif [[ "$cur_up" == "$upstream_url" ]]; then
                skipped "$dir  [upstream] already correct"
            else
                set_remote "$dir" "upstream" "$upstream_url"
                success "$dir  [upstream] updated → $upstream_url"
            fi

            # Pull only if not already on a branch with commits
            local commit_count
            commit_count=$(git -C "$dir" rev-list --count HEAD 2>/dev/null || echo 0)
            if [[ "$commit_count" -eq 0 ]]; then
                pull_branch "$dir" "origin"
            else
                skipped "$dir — already has commits, not pulling"
            fi
        done

        # ── Summary ────────────────────────────
        echo ""
        echo -e "  ${_c_green}╔══════════════════════════════════════════════╗${_c_reset}"
        echo -e "  ${_c_green}║            Fork Setup Complete!              ║${_c_reset}"
        echo -e "  ${_c_green}╚══════════════════════════════════════════════╝${_c_reset}"
        echo ""
        echo -e "  ${_c_dim}Remotes per submodule:${_c_reset}"
        summary_row "origin  " "→ github.com/$username/{repo}  (your fork)"
        summary_row "upstream" "→ upstream org  (sync with: git pull upstream main)"
        echo ""

    # ══════════════════════════════════════════
    #  CLONE path
    # ══════════════════════════════════════════
    elif [[ "$method" == "clone" ]]; then

        section "Configuring Remotes & Pulling"

        for (( i=0; i<sub_count; i++ )); do
            local dir="${SUB_PATH[$i]}"
            local org="${SUB_ORG[$i]}"
            local repo_name="${SUB_REPONAME[$i]}"
            local state="${SUB_STATE[$i]}"
            local upstream_url="https://github.com/$org/$repo_name.git"

            [[ "$state" == "fully_setup" || "$state" == "has_origin" ]] && {
                # Verify the existing origin matches
                local cur_origin
                cur_origin=$(git -C "$dir" remote get-url origin 2>/dev/null || true)
                if [[ "$cur_origin" == "$upstream_url" ]]; then
                    skipped "$dir — origin already correct"
                    continue
                fi
            }

            [[ -d "$dir" ]] || mkdir -p "$dir"
            ensure_git_init "$dir"

            local cur_origin
            cur_origin=$(git -C "$dir" remote get-url origin 2>/dev/null || true)
            if [[ -z "$cur_origin" ]]; then
                set_remote "$dir" "origin" "$upstream_url"
                success "$dir  [origin] $upstream_url"
            elif [[ "$cur_origin" == "$upstream_url" ]]; then
                skipped "$dir  [origin] already correct"
            else
                set_remote "$dir" "origin" "$upstream_url"
                success "$dir  [origin] updated → $upstream_url"
            fi

            local commit_count
            commit_count=$(git -C "$dir" rev-list --count HEAD 2>/dev/null || echo 0)
            if [[ "$commit_count" -eq 0 ]]; then
                pull_branch "$dir" "origin"
            else
                skipped "$dir — already has commits, not pulling"
            fi
        done

        echo ""
        echo -e "  ${_c_green}╔══════════════════════════════════════════════╗${_c_reset}"
        echo -e "  ${_c_green}║           Clone Setup Complete!              ║${_c_reset}"
        echo -e "  ${_c_green}╚══════════════════════════════════════════════╝${_c_reset}"
        echo ""
        echo -e "  ${_c_dim}Remotes per submodule:${_c_reset}"
        summary_row "origin" "→ upstream org (source)"
        echo ""
    fi
}

main "$@"