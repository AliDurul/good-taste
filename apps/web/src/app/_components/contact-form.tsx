"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inquirySchema, InquiryFormValues, MAIZE_PRODUCTS } from "@workspace/schemas";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@workspace/ui/components/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { toast } from "sonner";

export function ContactForm() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      product: undefined,
      quantity: undefined,
      message: "",
    },
  });

  async function onSubmit(_data: InquiryFormValues) {
    // Simulate network delay — wire to a Server Action or email service later
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Your inquiry has been sent! We'll get back to you soon.");
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup className="grid gap-5 sm:grid-cols-2">
        {/* Name */}
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Full Name *</FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="John Doe"
                aria-invalid={fieldState.invalid}
                disabled={isSubmitting}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Email */}
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email Address *</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                placeholder="you@example.com"
                aria-invalid={fieldState.invalid}
                disabled={isSubmitting}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Phone */}
        <Controller
          name="phone"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Phone Number *</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="tel"
                placeholder="+1 234 567 8900"
                aria-invalid={fieldState.invalid}
                disabled={isSubmitting}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Product */}
        <Controller
          name="product"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="product">Product *</FieldLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isSubmitting}
              >
                <SelectTrigger
                  id="product"
                  className="w-full"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {MAIZE_PRODUCTS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Quantity */}
        <Controller
          name="quantity"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="sm:col-span-2">
              <FieldLabel htmlFor={field.name}>Quantity (bags) *</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="number"
                min={1}
                placeholder="e.g. 100"
                aria-invalid={fieldState.invalid}
                disabled={isSubmitting}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.value)}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Message */}
        <Controller
          name="message"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="sm:col-span-2">
              <FieldLabel htmlFor={field.name}>
                Additional Message{" "}
                <span className="text-stone-400 font-normal">(optional)</span>
              </FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                rows={4}
                placeholder="Tell us more about your order, delivery location, or any special requirements…"
                aria-invalid={fieldState.invalid}
                disabled={isSubmitting}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <div className="sm:col-span-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 h-auto"
          >
            {isSubmitting ? "Sending…" : "Send Inquiry"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
