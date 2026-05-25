'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { userCreateSchema, userUpdateSchema, type UserCreate, type UserUpdate, type IUser } from '@workspace/schemas'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Field, FieldLabel, FieldError } from '@workspace/ui/components/field'
import { ImageIcon } from 'lucide-react'
import { useUploadThing } from '@/lib/uploadthing'
import { authClient } from '@/lib/auth-client'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@workspace/ui/components/select'
import { toast } from 'sonner'
import { createUser, updateUser } from '@/actions/mutations'

// Override birthday to accept YYYY-MM-DD from HTML date input instead of full ISO datetime
const createFormSchema = userCreateSchema
    .omit({ birthday: true })
    .extend({ birthday: z.string().optional() })

const updateFormSchema = userUpdateSchema
    .omit({ birthday: true, assignedAgentId: true })
    .extend({ birthday: z.string().optional() })

type UserFormValues = {
    name: string
    email: string
    password?: string
    role?: 'customer' | 'agent' | 'officer' | 'admin'
    phone?: string
    address?: string
    city?: string
    country?: string
    birthday?: string
    image?: string
    assignedAgentId?: string
}

interface UserFormEditProps {
    mode: 'edit'
    userId: string
    defaultValues?: Partial<UserFormValues>
    agents?: never
}
interface UserFormCreateProps {
    mode: 'create'
    userId?: never
    defaultValues?: never
    agents?: IUser[]
}
type UserFormProps = UserFormCreateProps | UserFormEditProps

export function UserForm({ mode, userId, defaultValues, agents = [] }: UserFormProps) {
    const router = useRouter()
    const isEdit = mode === 'edit'
    const { data: session } = authClient.useSession()
    const isAdmin = session?.user.role === 'admin'
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const { startUpload, isUploading } = useUploadThing('imageUploader')

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null
        setImageFile(file)
        if (imagePreview) URL.revokeObjectURL(imagePreview)
        setImagePreview(file ? URL.createObjectURL(file) : null)
    }

    const { control, handleSubmit, formState: { isSubmitting } } = useForm<UserFormValues>({
        resolver: zodResolver(isEdit ? updateFormSchema : createFormSchema) as Resolver<UserFormValues>,
        defaultValues: isEdit
            ? {
                name: '',
                email: '',
                phone: '',
                address: '',
                city: '',
                country: '',
                birthday: '',
                ...defaultValues,
            }
            : {
                name: '',
                email: '',
                password: '',
                role: 'customer',
                phone: '',
                address: '',
                city: '',
                country: '',
                birthday: '',
                assignedAgentId: '',
            },
    })

    const isLoading = isSubmitting || isUploading

    async function onSubmit(values: UserFormValues) {
        // Convert empty strings to undefined and birthday to full ISO datetime
        const cleaned = Object.fromEntries(
            Object.entries(values).map(([k, v]) => [k, v === '' ? undefined : v])
        ) as UserFormValues

        if (cleaned.birthday) {
            cleaned.birthday = `${cleaned.birthday}T00:00:00.000Z`
        }

        let result: { success: boolean; message?: string }

        if (isEdit && userId) {
            result = await updateUser(userId, cleaned as UserUpdate)
        } else {
            let imageUrl: string | undefined
            if (imageFile) {
                const res = await startUpload([imageFile])
                if (!res?.[0]?.ufsUrl) {
                    toast.error('Image upload failed. Please try again.')
                    return
                }
                imageUrl = res[0].ufsUrl
            }
            result = await createUser({ ...(cleaned as UserCreate), image: imageUrl })
        }

        if (result.success) {
            toast.success(isEdit ? 'User updated successfully.' : 'User created successfully.')
            if (isEdit) {
                router.back()
            } else {
                router.push('/dashboard/users')
            }
        } else {
            toast.error(result.message ?? 'Something went wrong. Please try again.')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
            {/* ── Account Information ───────────────────────────────── */}
            <section className="flex flex-col gap-6">
                <div>
                    <h3 className="text-lg font-semibold">Account Information</h3>
                    <p className="text-sm text-muted-foreground">
                        Basic account details for the user.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                    {/* Profile Image */}
                    <div className="flex flex-col gap-2">
                        <FieldLabel>Profile Image</FieldLabel>
                        <div className="flex items-start gap-4">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Profile preview"
                                    className="h-20 w-20 shrink-0 rounded-full border object-cover"
                                />
                            ) : (
                                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border bg-muted">
                                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                </div>
                            )}
                            <div className="flex flex-1 flex-col gap-1">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={isLoading}
                                    className="cursor-pointer"
                                />
                                <p className="text-xs text-muted-foreground">
                                    PNG, JPG or WEBP — up to 4 MB. Optional.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Name */}
                    <Controller
                        name="name"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="e.g. Lee"
                                    aria-invalid={fieldState.invalid}
                                    disabled={isLoading}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    {/* Email */}
                    <Controller
                        name="email"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="email"
                                    placeholder="e.g. lee@example.com"
                                    aria-invalid={fieldState.invalid}
                                    disabled={isLoading}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    {/* Password — create mode only */}
                    {!isEdit && (
                        <Controller
                            name="password"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="password"
                                        placeholder="Min. 8 characters"
                                        aria-invalid={fieldState.invalid}
                                        disabled={isLoading}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    )}

                    <Controller
                        name="role"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Role</FieldLabel>
                                <Select
                                    value={field.value ?? 'customer'}
                                    onValueChange={field.onChange}
                                    disabled={isLoading}
                                >
                                    <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="customer">Customer</SelectItem>
                                        <SelectItem value="agent">Agent</SelectItem>
                                        <SelectItem value="officer">Officer</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    {/* Assigned Agent — create mode, admin only */}
                    {!isEdit && isAdmin && agents.length > 0 && (
                        <Controller
                            name="assignedAgentId"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Assigned Agent</FieldLabel>
                                    <Select
                                        value={field.value ?? ''}
                                        onValueChange={field.onChange}
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder="Select an agent (optional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {agents.map(agent => (
                                                <SelectItem key={agent.id} value={agent.id}>
                                                    {agent.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    )}

                </div>
            </section>

            <div className="border-t" />

            {/* ── Personal Details ──────────────────────────────────── */}
            <section className="flex flex-col gap-6">
                <div>
                    <h3 className="text-lg font-semibold">Personal Details</h3>
                    <p className="text-sm text-muted-foreground">
                        Optional personal information for the user.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Phone */}
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                                <Input
                                    {...field}
                                    value={field.value ?? ''}
                                    id={field.name}
                                    type="tel"
                                    placeholder="e.g. +260 97..."
                                    aria-invalid={fieldState.invalid}
                                    disabled={isLoading}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    {/* Birthday */}
                    <Controller
                        name="birthday"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Birthday</FieldLabel>
                                <Input
                                    {...field}
                                    value={field.value ?? ''}
                                    id={field.name}
                                    type="date"
                                    aria-invalid={fieldState.invalid}
                                    disabled={isLoading}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    {/* Country */}
                    <Controller
                        name="country"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Country</FieldLabel>
                                <Input
                                    {...field}
                                    value={field.value ?? ''}
                                    id={field.name}
                                    placeholder="e.g. Zambia"
                                    aria-invalid={fieldState.invalid}
                                    disabled={isLoading}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    {/* City */}
                    <Controller
                        name="city"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>City</FieldLabel>
                                <Input
                                    {...field}
                                    value={field.value ?? ''}
                                    id={field.name}
                                    placeholder="e.g. Lusaka"
                                    aria-invalid={fieldState.invalid}
                                    disabled={isLoading}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    {/* Address */}
                    <Controller
                        name="address"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field className="sm:col-span-2" data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                                <Input
                                    {...field}
                                    value={field.value ?? ''}
                                    id={field.name}
                                    placeholder="e.g. 123 Cairo Road"
                                    aria-invalid={fieldState.invalid}
                                    disabled={isLoading}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </div>
            </section>

            {/* ── Actions ───────────────────────────────────────────── */}
            <div className="flex justify-end gap-3 border-t pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => (isEdit ? router.back() : router.push('/dashboard/users'))}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isUploading
                        ? 'Uploading image...'
                        : isSubmitting
                            ? isEdit ? 'Saving...' : 'Creating...'
                            : isEdit ? 'Save Changes' : 'Create User'}
                </Button>
            </div>
        </form>
    )
}
