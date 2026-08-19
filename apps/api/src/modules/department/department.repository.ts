import {prisma} from "../../config/prisma"

type CreateDepartmentData = {
    name: string;
    description?: string
}

type UpdateDepartmentData = {
    name?:string;
    description?:string
}

export const findDepartmentByName = async(name:string)=>{
    return prisma.department.findUnique({
        where:{name}
    })
}

export const findDepartmentById = async(id:string)=>{
    return prisma.department.findUnique({
      where: { id },
    });
}

export const findAllDepartments = async()=>{
    return prisma.department.findMany({
        orderBy:{
            createdAt:"desc"
        }
    })
}

export const createDepartment = async(data:CreateDepartmentData)=>{
    return prisma.department.create({
        data
    })
}

export const UpdateDepartment = async(id:string,data:UpdateDepartmentData)=>{
    return prisma.department.update({
      where: { id },
      data,
    });
}