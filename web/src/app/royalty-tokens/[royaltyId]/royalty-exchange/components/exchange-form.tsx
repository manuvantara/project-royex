'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const types = z.enum(['sell', 'buy']);

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ExchangeForm() {
  const [type, setType] = useState<z.infer<typeof types>>(types.enum.sell);
  // 1. Define your form.
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: FormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values, `type: ${type}`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Royalty Exchange</CardTitle>
        <CardDescription>Provide how many royalty tokens you want to buy or sell.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>This is your public display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="First Last" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" placeholder="" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="number">Card number</Label>
          <Input id="number" placeholder="" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="cvc">CVC</Label>
            <Input id="cvc" placeholder="CVC" />
          </div>
        </div> */}
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-4">
            <Button onClick={() => setType(types.enum.sell)} type="submit">
              Sell
            </Button>
            <Button onClick={() => setType(types.enum.buy)} type="submit">
              Buy
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
