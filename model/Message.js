const mongoose = require('mongoose');
const Category =  require('./Category');


const messageSchema = new mongoose.Schema({ 
    text: {type: String ,required: true},
    notificationDate :{type: Date},
    timeWindowBefore :{type:Number, default: 1},
    timeWindowAfter :{type:Number, default: 1},
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    }
},
    { timestamps: true },
    );

const Message = mongoose.model('Messsage', messageSchema )

module.exports = Message