import seedData from './inputData.json';
import Employee from '../models/Employee';
import { createEmployeeWithoutError, getEmployeeTree } from '../database/employee';

// console.log(seedData);
// seedData.forEach(async ([name, supervisor]) => {
//   await createEmployeee(name, supervisor);
// });
async function execSeed() {
  try {
    deleteAllEmployees();
    for (const [employee, supervisor] of Object.entries(seedData)) {
      try {
        await createEmployeeWithoutError(employee, supervisor as string);
      } catch (err) {
        console.log(err);
      }
    }

    const employeeTree = await getEmployeeTree();
    console.log(employeeTree);
  } catch (err) {
    console.log('Error seeding data: ', err);
  }
}

function deleteAllEmployees() {
  try {
    Employee.deleteMany({}).then(() => console.log('Deleted all employees'));
  } catch (err) {
    console.log(err);
  }
}

execSeed();


