import { evaluate, parse } from './lisp';
import readline from 'readline';
const rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt('lisp $ ');
rl.prompt();
rl.on('line', function(line) {
    if (line === "exit!") rl.close();
		try {
      console.log(evaluate(parse(line)));
    } catch (msg) {
      console.log(msg);
    }
    rl.prompt();
}).on('close',function(){
    process.exit(0);
});
