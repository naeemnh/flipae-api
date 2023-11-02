import { Request, Response } from "express";
import { createEmployee, findAllEmployees, findEmployeeAndSupervisor } from "../database/employee";

export const setJsonEmployeeSupervisor = async (req: Request, res: Response) => {

  for (const [employee, supervisor] of Object.entries(req.body)) {
    await createEmployee(employee, supervisor as string);
  }
}

export const setSupervisor = async (req: Request, res: Response) => {
  try {
    const { employeeName, supervisorName } = req.body;
    const { employee, supervisor, error } = await findEmployeeAndSupervisor(employeeName, supervisorName);

    if (error == 0) {
      return res.status(500).json({
        employee: null,
        errorCode: `SS${error}`,
      })
    }
    employee!.supervisor = supervisor!._id;
    await employee!.save();

    return res.status(200).json({
      employee: { ...employee! },
      errorCode: null,
    })
  } catch (err) {
    return {
      employee: null,
      error: err,
    }
  }
}

export const getEmployeeTree = async (req: Request, res: Response) => {
  try {
    const employeeTree = await findAllEmployees();
    return res.status(200).json(employeeTree);
  } catch (err) {
    return res.status(500).json(err);
  }
}