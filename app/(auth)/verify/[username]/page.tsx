"use client"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form' 
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { verifySchema } from '@/src/schemas/verifySchema'
import { ApiResponse } from '@/src/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { useParams, useRouter } from 'next/navigation'  
import { useForm } from 'react-hook-form'
import { toast } from "sonner"
import * as z from 'zod'

const VerifyAccount = () => {

    const router = useRouter()
    const params = useParams<{username: string}>()

    //zod implementation
      const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema) 
      });
    
    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
          const response = await axios.post(`/api/verify-code`, {username: params.username, code: data.code})
          toast.success(response.data.message, { position: "top-right" })

          router.replace('/sign-in')
          
        } catch (error) {
          console.error("Error in sign-up of user", error)
          const axiosError = error as AxiosError<ApiResponse>;
          let errorMessage = axiosError.response?.data.message 
          toast.error(errorMessage || "Verify failed", { position: "top-right" }) 
        }
    }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Verify Your Account</h1>
          <p className='mb-4'>Enter the verification code sent to your email</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>  
                    <InputOTP id="digits-only" value={field.value} onChange={field.onChange} maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>   
                  <FormMessage />
                </FormItem>
              )}
            /> 
            <Button className='cursor-pointer' type="submit">Submit</Button>

          </form>
        </Form>

      </div>
    </div>
  )
}

export default VerifyAccount
