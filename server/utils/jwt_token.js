export const generateToken=(user,msg,statusCode,res)=>{
const token =user.generateJsonToken()
return res.status(statusCode).cookie(
    "token",token,{
        expires:new Date(
            Date.now()+process.env.COOKIE_EXPIRE*24*60*60*1000,
        ),
        httpOnly:true,
    }
).json({success:true,msg,token,user});
}