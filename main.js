import { spawnSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { 
    parseExpr,      
    symDiff,        
    symIntegrate,  
    symSimplify,   
    symToLatex      
} from './src/symbolic.js'; 

const __dirname = dirname(fileURLToPath(import.meta.url));
const predictScript = join(__dirname, 'script', 'predict.py');

export function runSlangPipeline(userSlangInput) {
    try {
        
        const mathString = userSlangInput.replace(/[a-zA-Z\s]+(of|find|the)\s+/ig, '').trim();
        
       
        let intent = ""; 
        try {
            const pythonProcess = spawnSync('python', [predictScript, userSlangInput], { encoding: 'utf-8' });
            if (!pythonProcess.error && pythonProcess.stdout) {
                intent = pythonProcess.stdout.trim().toLowerCase();
            }
        } catch (e) {
            
        }
        
        
        const mathAst = parseExpr(mathString);
        
        
        let solvedAst;
        const lowerInput = userSlangInput.toLowerCase(); 
        
        if (intent.includes('deriv') || lowerInput.includes('deriv')) {
            solvedAst = symDiff(mathAst, 'x'); 
        } else if (intent.includes('integr') || lowerInput.includes('integr')) {
            solvedAst = symIntegrate(mathAst, 'x'); 
        } else {
            solvedAst = mathAst; 
        }
        
        
        const simplifiedAst = symSimplify(solvedAst);
        
        
        let rawResult = symToLatex(simplifiedAst);
        
        
        rawResult = rawResult.replace(/\s+/g, '');
        
        return `🔥 Result: ${rawResult}`;

    } catch (error) {
        return `🔥 Pipeline crashed. Error: ${error.message}`;
    }
}


const userInput = process.argv[2];

if (userInput) {
    
    console.log(runSlangPipeline(userInput));
}
