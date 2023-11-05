import mongoose, { Model, Schema } from 'mongoose';

export interface IEmployee {

  name: string;
  supervisor?: IEmployee
}



const employeeSchema = new Schema<any, IEmployee>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  supervisor: {
    type: Schema.Types.ObjectId,
    ref: 'employees'
  }
});

const Employee = mongoose.model('employees', employeeSchema);

export default Employee;