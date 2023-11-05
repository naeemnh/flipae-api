import Employee, { IEmployee } from "../models/Employee";

/**
 * Get Employee by Name from Database
 * @param name Name of Employee
 * @returns Employee
 */
export async function findEmployeeByName(name: string) {
  console.log('searching for employee')
  try {
    const employee = await Employee.findOne({ name })
    console.log(employee)
    return employee;
  } catch (err) {
    return null;
  }
}

/**
 * Get Employee Tree from Database
 * @returns Employee Tree
 */
export async function getEmployeeTree(): Promise<Record<string, Record<string, any>[]>> {
  const employeeTree: Record<string, Record<string, any>[]> = {};
  const employees = await Employee.find().populate('supervisor');

  employees.forEach(({name, supervisor}) => {
    if (!supervisor) {
      // This is the top-level supervisor
      const supervisorName = name;
      employeeTree[supervisorName] = buildSubEmpTree(employees, {name: supervisorName});
    }
    // } else {
    //   // Find the supervisor's parent node
    //   const supervisorName = employees.find(e => e._id.toString() === supervisor._id.toString())!.name
    //   const parent = employeeTree[supervisorName];
    //   if (parent) {
    //     // Create an empty array for the current employee
    //     parent.push({ [name]: [] });
    //   }
  });
  return employeeTree;
}

/**
 * Build Sub Employee Tree
 * @param employees List of Employees
 * @param supervisor Supervisor
 * @returns Sub Employee Tree
 */
function buildSubEmpTree(employees: any, supervisor: IEmployee): Record<string, any>[] {
  let subordinates: Record<string, any>[] = [];
  const subEmployee = employees.filter((e: any) => e.supervisor && e.supervisor.name === supervisor.name);
  subEmployee.forEach((e: any) => {
    const subName = e.name;
    const subtree = buildSubEmpTree(employees, e);
    subordinates.push({ [subName]: subtree });
  });

  if (subordinates.length === 0) {
    return [];
  }
  return subordinates;
}

/**
 * Find Employee and Supervisor in Database
 * @param employeeName Name of Employee
 * @param supervisorName Name of Supervisor
 * @returns Employee, Supervisor, and Error Code
 */
export async function findEmployeeAndSupervisor(employeeName: string, supervisorName: string) {
  const employee = await findEmployeeByName(employeeName);
  const supervisor = await findEmployeeByName(supervisorName);
  let error = 0;
  error = employee ? error + 10 : error;
  error = supervisor ? error + 1 : error;
  return { employee, supervisor, error: `ES${error}`};
}

export async function listEmployees() {
  try {
    const employees = await Employee.find().populate('supervisor');
    return employees;
  } catch (err) {
    return null;
  }
}

/**
 * Import JSON data of employees and supervisors in Database
 * @param json JSON data of employees and supervisors
 * @returns boolean
 */
export async function createEmployeeSupervisorByJson(json: any): Promise<Boolean> {
  try {
    for (const [employee, supervisor] of Object.entries(json)) {
      await createEmployeeWithoutError(employee, supervisor as string);
    }
    return true;
  } catch (err){
    return false
  }
}

/**
 * Create New Employee in Database
 * @param employeeName Name of Employee
 * @param supervisorName Name of Supervisor
 * @returns New Employee
 */
export async function createEmployee(employeeName: string) {
  console.log('function called')
  try {
    let newEmployee = new Employee({name: employeeName});
    const employeeExists = await findEmployeeByName(employeeName);
    console.log(employeeExists);
    // Employee Exists
    if (employeeExists) console.log(employeeExists)
    if (employeeExists) return { employee: null, error: "Employee Already Exists" }

    newEmployee = await newEmployee.save();
    return { employee: {...newEmployee}, error: null }
  } catch (err) {
    return {employee: null, error: err}
  }
}

/**
 * Create New Supervisor in Database
 * @param supervisorName Name of New Supervisor
 * @param subEmployeeName Name of Employee to be supervised
 * @returns New Supervisor and Sub Employee
 */
export async function createSupervisor(supervisorName: string, subEmployeeName: string) {
  try {
    let subEmployee = await findEmployeeByName(subEmployeeName);
    
    let newSupervisor = new Employee({name: supervisorName});

    if (subEmployee!.supervisor) newSupervisor.supervisor = subEmployee!.supervisor._id;

    newSupervisor = await newSupervisor.save();
    subEmployee = await subEmployee?.updateOne({supervisor: newSupervisor._id});
    return { supervisor: {...newSupervisor}, subEmployee: {...subEmployee}, error: null }
  } catch (err) {
    return {
      supervisor: null,
      subEmployee: null,
      error: err,
    }
  }
}

export async function updateEmployeeSupervisor(employeeName: string, supervisorName: string) {
  try {
    const { employee, supervisor, error } = await findEmployeeAndSupervisor(employeeName, supervisorName);
    const errorString: {[key: string]: string} = {
      'ES1': `Employee ${employeeName} exists, but Supervisor ${supervisorName} does not exist`,
      'ES10': `Employee ${employeeName} does not exist, but Supervisor ${supervisorName} exists`,
      'ES11': `Employee ${employeeName} and Supervisor ${supervisorName} do not exist`,
    }


    if (error !== 'ES0' ) {
      return {
        employee: null,
        error: errorString[error],
      }
    }
    employee!.supervisor = supervisor!._id;
    await employee!.save();

    return {
      employee: { ...employee! },
      error: null,
    }
  } catch (err) {
    return {
      employee: null,
      error: err,
    }
  }
}

/**
 * Create New Employee in Database without Error Handling
 * @param employeeName Name of Employee
 * @param supervisorName Name of Supervisor
 * @returns New Employee with Supervisor
 */
export async function createEmployeeWithoutError(employeeName: string, supervisorName?: string) {
  try {
    let newEmployee = new Employee({ name: employeeName });
    const employeeExists = await findEmployeeByName(employeeName);
    if (employeeExists) {
      newEmployee = employeeExists;
    }
    if (supervisorName) {
      supervisorName = supervisorName.trim();
      const supervisorExists = await findEmployeeByName(supervisorName);
      if (supervisorExists) {
        newEmployee.supervisor = supervisorExists._id;
      } else {
        const newSupervisor = new Employee({ name: supervisorName });
        await newSupervisor.save();
        newEmployee.supervisor = newSupervisor._id;
      }
    }
    newEmployee = await newEmployee.save();

    return {
      employee: { ...newEmployee },
      error: null,
    }
  } catch (err) {
    return {
      employee: null,
      error: err,
    }
  }
}

export async function deleteEmployeeByName(employeeName: string) {
  try {
    const employee = await findEmployeeByName(employeeName);
    if (!employee) {
      return {
        employee: null,
        error: `Employee ${employeeName} does not exist`,
      }
    }

    // search for subordinates
    const subordinates = await Employee.find({ supervisor: employee._id });
    // If Employee has supordinates, set their supervisor to Employee's supervisor
    if (subordinates.length > 0) {

      subordinates.forEach(async (subordinate) => {
        subordinate.supervisor = employee.supervisor;
        await subordinate.save();
      });
    }
    
    const deletedEmployee = await employee.deleteOne();
    return {
      employee: { ...deletedEmployee },
      error: null,
    }
  } catch (err) {
    return {
      employee: null,
      error: err,
    }
  }
}
