import express from 'express';
import cors from 'cors';
import {exec} from 'child_process';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());


app.post('/api/check-spam' , (req,res) => {
    const {message} = req.body; 

    if(!message)
    {
        return res.status(400).json({error:"message is empty"});
    }

    
    exec(`py predict_spam.py "${message}"`, (err, stdout, stderr) => {
        if (err) {
          console.error("Error:", err);
          res.status(500).send('Error occurred while predicting spam');
        } else {
          
          console.log("Python Script Output:", stdout);
          const spamProbability = parseFloat(stdout); 
          const isSpam = (spamProbability>0.5) ? true : false;
    
          res.json({ spam_probability: spamProbability,isSpam: isSpam}); 
        }
    });
});


app.listen(port,() => {
    console.log(`server started on ${port}`);
})