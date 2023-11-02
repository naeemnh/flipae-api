import { Document, Model } from "mongoose";
import Employee, { IEmployee } from "../models/Employee";

export async function findEmployeeByName(name: string) {
  return await Employee.findOne({ name: name });
}

export async function createEmployeeSupervisorByJson(json: any) {
  for (const [employee, supervisor] of Object.entries(json)) {
    await createEmployee(employee, supervisor as string);
  }
}

export async function createEmployee(employee: string, supervisor: string) {
  try {
    let newEmployee = new Employee({ name: employee });
    const employeeExists = await findEmployeeByName(employee);
    if (employeeExists) {
      newEmployee = employeeExists;
    }
    if (supervisor) {
      supervisor = supervisor.trim();
      const superviserExists = await findEmployeeByName(supervisor);
      if (superviserExists) {
        newEmployee.supervisor = superviserExists._id;
      } else {
        const newSupervisor = new Employee({ name: supervisor });
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

export async function findAllEmployees(): Promise<Record<string, Record<string, any>[]>> {
  const employeeTree: Record<string, Record<string, any>[]> = {};
  const employees = await Employee.find().populate('supervisor');

  console.log(employees);

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
  console.log(subordinates)
  return subordinates;
}

export async function findEmployeeAndSupervisor(employeeName: string, supervisorName: string) {
  const employee = await findEmployeeByName(employeeName);
  const supervisor = await findEmployeeByName(supervisorName);
  let error = 0;
  error = employee ? error + 10 : error;
  error = supervisor ? error + 1 : error;
  return {employee, supervisor, error};
}