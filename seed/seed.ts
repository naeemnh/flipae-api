import seedData from './data.json';
import Employee from '../models/Employee';
import { createEmployee, findAllEmployees } from '../database/employee';

// console.log(seedData);
// seedData.forEach(async ([name, supervisor]) => {
//   await createEmployeee(name, supervisor);
// });
async function execSeed() {
  try {

    let employees = await Employee.find();
    await Employee.deleteMany({}).then(() => console.log('Deleted all employees'));

    for (const [employee, supervisor] of Object.entries(seedData)) {
      try {
        await createEmployee(employee, supervisor);
      } catch (err) {
        console.log(err);
      }
    }

    const employeeTree = await findAllEmployees();
    console.log(employeeTree);
  } catch (err) {
    console.log('Error seeding data: ', err);
  }

}

execSeed();


