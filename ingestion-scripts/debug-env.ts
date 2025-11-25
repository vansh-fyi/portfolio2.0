import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const paths = [
    path.resolve(__dirname, '../vansh.fyi/.env.local'), // Wrong relative to src
    path.resolve(__dirname, '../../vansh.fyi/.env.local'), // Wrong
    path.resolve(__dirname, '../../../vansh.fyi/.env.local'), // Correct from src/services? No, this is root of repo
    path.resolve(process.cwd(), '../vansh.fyi/.env.local')
];

console.log('CWD:', process.cwd());
console.log('__dirname:', __dirname);

paths.forEach(p => {
    const exists = fs.existsSync(p);
    console.log(`Path: ${p}, Exists: ${exists}`);
    if (exists) {
        const result = dotenv.config({ path: p });
        console.log('Dotenv result:', result.error ? 'Error' : 'Success');
        if (result.parsed) {
            console.log('Keys found:', Object.keys(result.parsed));
        }
    }
});

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
