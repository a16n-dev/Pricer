import * as fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'
import transform from './transform';
import { walk } from "./util";

const outPath = 'out'

walk('src', (err, results) => {
    if(err){
        console.log(err);
    }

    // Generate output folder
    const outputDir = path.resolve(__dirname, `../${outPath}`);
    if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
    }

    let functions = {}

    results.forEach(f => {
        functions = {
            ...functions,
            ...transform(f, outPath)
        }
    })

    //Write functions to serverless.yml
    try {
        const doc: any = yaml.safeLoad(fs.readFileSync('./serverless.yml', 'utf8'));

        doc.functions = functions

        fs.writeFile('./serverless.yml', yaml.safeDump(doc), (err) => {
            if (err) {
                console.log(err);
            }
        });

      } catch (e) {
        console.log(e);
      }
})