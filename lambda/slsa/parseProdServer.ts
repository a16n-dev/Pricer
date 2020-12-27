import fs from 'fs'
import yaml from 'js-yaml'

const parseProdServer = () => {
    const buffer = fs.readFileSync('./.deployinfo')
    const data = buffer.toString();
    const serverURL = data.match(/https:\/\/.*\.com/)
    return `${serverURL[0]}/dev`
}

const modifyDocs = () => {
    try {
        const apidocs: any = yaml.safeLoad(fs.readFileSync('./openAPI.yml', 'utf8'));

        apidocs.servers.push({
            url: parseProdServer(),
            description: 'Production server'
        })

        fs.writeFile('./openAPI.yml', yaml.safeDump(apidocs), (err) => {
            if (err) {
                console.log(err);
            }
        });
        
    } catch (e) {
        console.log(e);
    }
}

modifyDocs()