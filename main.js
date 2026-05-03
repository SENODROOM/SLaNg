import { spawnSync } from 'child_process';
import { 
    parseExpr,      
    symDiff,        
    symIntegrate,  
    symSimplify,   
    symToLatex      
} from './slang-math.js'; 

export function runSlangPipeline(userSlangInput) {
    try {
        
        const mathString = userSlangInput.replace(/[a-zA-Z\s]+(of|find|the)\s+/ig, '').trim();
        
       
        let intent = ""; 
        try {
            const pythonProcess = spawnSync('python', ['predict.py', userSlangInput], { encoding: 'utf-8' });
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
