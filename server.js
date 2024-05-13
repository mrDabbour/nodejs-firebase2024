const express = require('express');
const {FieldValue} = require('firebase-admin/firestore');
const app = express();
const port = 6001;
const{db} = require('./firebase.js');
const { stat } = require('fs');

app.use(express.json());

//for test 
const employees ={
    
    'ramy':'employee',
    'larry':'employee',
    'brown':'employee',
    'jack':'employee',
    'brouse':'manager',
};



app.post('/addemployee', async (req, res) => {
    const { name, status } = req.body;

    try {
        const peopleRef = db.collection('people').doc('associates');
        await peopleRef.set({
            [name]: status
        }, { merge: true });

        res.status(200).json({ message: 'Employee added successfully.', name, status });
    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).json({ error: 'An error occurred while adding employee.' });
    }
});

app.patch('/changestatus', async (req, res) => {
    const { name, newStatus } = req.body;

    try {
        const peopleRef = db.collection('people').doc('associates');
        const doc = await peopleRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Employee database not found.' });
        }

        const employees = doc.data();

        if (!(name in employees)) {
            return res.status(404).json({ error: 'Employee not found.' });
        }

        await peopleRef.update({
            [name]: newStatus
        });

        res.status(200).json({ message: 'Employee status updated successfully.', name, newStatus });
    } catch (error) {
        console.error('Error updating employee status:', error);
        res.status(500).json({ error: 'An error occurred while updating employee status.' });
    }
});

app.delete('/employee', async (req, res) => {
    const { name } = req.body;

    try {
        const peopleRef = db.collection('people').doc('associates');
        const doc = await peopleRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Employee database not found.' });
        }

        const employees = doc.data();

        if (!(name in employees)) {
            return res.status(404).json({ error: 'Employee not found.' });
        }

        await peopleRef.update({
            [name]: FieldValue.delete()
        });

        res.status(200).json({ message: 'Employee deleted successfully.', name });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ error: 'An error occurred while deleting employee.' });
    }
});


app.listen(port ,()=>{
    console.log(`Server has started on port: ${port} ...`);
})