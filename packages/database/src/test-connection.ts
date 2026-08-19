import {prisma} from "./client.js"

try {
    await prisma.$queryRaw`SELECT 1`
    console.log("DB connection successfull")
} catch (error) {
    console.error("DB connection FAILED: ",error)
    process.exitCode = 1

} finally{
    await prisma.$disconnect()
}