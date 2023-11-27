// 'use client';

// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { toast } from 'sonner';
// import { parseEther } from 'viem';
// import { useContractRead, useContractWrite, usePublicClient } from 'wagmi';
// import * as z from 'zod';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Skeleton } from '@/components/ui/skeleton';
// import { useMounted } from '@/hooks/use-mounted';

// const formSchema = z.object({
//   checkpointKey: z.coerce.number().positive({
//     message: 'Checkpoint must be > 0',
//   }),
//   amount: z.coerce.number().positive({
//     message: 'Withdrawal amount must be > 0',
//   }),
// });

// type FormValues = z.infer<typeof formSchema>;

// export default function WithdrawRoyaltiesForm() {
//   const mounted = useMounted();
//   const publicClient = usePublicClient();

//   const getCurrentCheckpointKey = useContractRead({
//     address: ROYALTY_TOKEN_ADDRESS,
//     abi: ROYALTY_TOKEN_ABI,
//     functionName: 'getCurrentCheckpointKey',
//     watch: true,
//   });

//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       checkpointKey: getCurrentCheckpointKey.data,
//       amount: 3,
//     },
//   });

//   const withdrawRoyalties = useContractWrite({
//     address: ROYALTY_PAYMENT_POOL_ADDRESS,
//     abi: ROYALTY_PAYMENT_POOL_ABI,
//     functionName: 'withdrawRoyalties',
//   });

//   async function onSubmit(values: FormValues) {
//     // withdraw royalties
//     try {
//       const withdrawRoyaltiesHash = await withdrawRoyalties.writeAsync({
//         args: [values.checkpointKey, parseEther(values.amount.toString())],
//       });
//       await publicClient.waitForTransactionReceipt({
//         hash: withdrawRoyaltiesHash.hash,
//       });

//       toast.success('Royalties withdrawn');
//     } catch (error: any) {
//       toast.error(error.message);
//     }
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Withdraw Royalties</CardTitle>
//         <CardDescription>Enter the amount to withdraw at the checkpoint.</CardDescription>
//         <div>
//           {!mounted ? (
//             <Skeleton className="h-[20px] w-[100px] rounded-full" />
//           ) : (
//             <div>Current checkpoint {getCurrentCheckpointKey.data}</div>
//           )}
//         </div>
//       </CardHeader>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)}>
//           <CardContent className="grid gap-6">
//             <FormField
//               control={form.control}
//               name="checkpointKey"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Checkpoint Key</FormLabel>
//                   <FormControl>
//                     <Input placeholder="1" {...field} />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="amount"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>USDC $</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Amount of stablecoins to withdraw" {...field} />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />
//           </CardContent>
//           <CardFooter>
//             <Button type="submit">Withdraw royalties</Button>
//           </CardFooter>
//         </form>
//       </Form>
//     </Card>
//   );
// }
