import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native'
import { Box } from '@/components/ui/box'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input'
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from '@/components/ui/button'
import {
    FormControl,
    FormControlError,
    FormControlErrorText,
    FormControlHelper,
    FormControlHelperText,
    FormControlLabel,
    FormControlLabelText,
} from '@/components/ui/form-control'
import { Progress, ProgressFilledTrack } from '@/components/ui/progress'
import { DateTimePicker, DateTimePickerInput, DateTimePickerTrigger, DateTimePickerIcon } from '@/components/ui/date-time-picker'
import { CalendarDays } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import {
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeClosed,
    Lock,
    Mail,
    MapPin,
    Phone,
    Tag,
    User,
} from 'lucide-react-native'

type RegisterFormData = {
    fullName: string
    phone: string
    email: string
    password: string
    confirmPassword: string
    town: string
    dateOfBirth: string
    referralCode: string
}

function getPasswordStrength(password: string): { label: string; color: string; width: string } {
    if (!password) return { label: '', color: '', width: 'w-0' }
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    if (score <= 1) return { label: 'Weak', color: 'bg-destructive', width: 'w-1/3' }
    if (score <= 2) return { label: 'Medium', color: 'bg-yellow-500', width: 'w-2/3' }
    return { label: 'Strong', color: 'bg-green-500', width: 'w-full' }
}

const VALID_REFERRAL = 'GOODTASTE2024'

export default function Register() {
    const router = useRouter()
    const [step, setStep] = useState<1 | 2>(1)
    const [showPass, setShowPass] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [referralStatus, setReferralStatus] = useState<'idle' | 'valid' | 'invalid'>('idle')

    const {
        control,
        handleSubmit,
        trigger,
        watch,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        defaultValues: {
            fullName: '',
            phone: '',
            email: '',
            password: '',
            confirmPassword: '',
            town: '',
            dateOfBirth: '',
            referralCode: '',
        },
    })

    const passwordValue = watch('password')
    const strength = getPasswordStrength(passwordValue)

    const handleNext = async () => {
        const valid = await trigger(['fullName', 'phone', 'password', 'confirmPassword'])
        if (valid) setStep(2)
    }

    const handleRegister = async (data: RegisterFormData) => {
        console.log('Register:', data)
        // TODO: call auth API
        router.replace('/')
    }

    const checkReferral = (code: string) => {
        if (!code) { setReferralStatus('idle'); return }
        setReferralStatus(code.toUpperCase() === VALID_REFERRAL ? 'valid' : 'invalid')
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <Box className="flex-1 items-center justify-center bg-[#022e1f] px-6 py-12 gap-6">

                    {/* Header */}
                    <Box className="w-full gap-2">
                        <Heading size="2xl" className="text-center text-secondary-foreground">
                            {step === 1 ? 'Join Good Taste' : 'Almost there'}
                        </Heading>
                        <Text size="sm" className="text-center text-secondary-foreground/60">
                            Step {step} of 2
                        </Text>
                        <Progress value={step === 1 ? 50 : 100} className="w-full h-1.5 mt-2 bg-secondary-foreground/20">
                            <ProgressFilledTrack className="bg-[#917400]" />
                        </Progress>
                    </Box>

                    {step !== 1 ? (
                        <Box className="w-full gap-5">
                            {/* Full Name */}
                            <FormControl isInvalid={!!errors.fullName}>
                                <FormControlLabel>
                                    <FormControlLabelText className={errors.fullName ? 'text-destructive' : 'text-secondary-foreground'}>
                                        Full Name
                                    </FormControlLabelText>
                                </FormControlLabel>
                                <Controller
                                    name="fullName"
                                    control={control}
                                    rules={{ required: 'Full name is required' }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Input className={`bg-secondary-foreground ${errors.fullName ? 'border-2 border-destructive' : ''}`}>
                                            <InputSlot className="pl-3">
                                                <InputIcon as={User} className="text-muted-foreground" />
                                            </InputSlot>
                                            <InputField
                                                placeholder="Your name.."
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                            />
                                        </Input>
                                    )}
                                />
                                <FormControlError>
                                    <FormControlErrorText>{errors.fullName?.message}</FormControlErrorText>
                                </FormControlError>
                            </FormControl>

                            {/* Phone */}
                            <FormControl isInvalid={!!errors.phone}>
                                <FormControlLabel>
                                    <FormControlLabelText className={errors.phone ? 'text-destructive' : 'text-secondary-foreground'}>
                                        Phone Number
                                    </FormControlLabelText>
                                </FormControlLabel>
                                <Controller
                                    name="phone"
                                    control={control}
                                    rules={{ required: 'Phone number is required' }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Input className={`bg-secondary-foreground ${errors.phone ? 'border-2 border-destructive' : ''}`}>
                                            <InputSlot className="pl-3">
                                                <Text size="sm" className="text-muted-foreground font-medium">+260</Text>
                                            </InputSlot>
                                            <InputField
                                                placeholder="97 123 4567"
                                                keyboardType="phone-pad"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                            />
                                        </Input>
                                    )}
                                />
                                <FormControlError>
                                    <FormControlErrorText>{errors.phone?.message}</FormControlErrorText>
                                </FormControlError>
                            </FormControl>

                            {/* Email (optional) */}
                            <FormControl isInvalid={!!errors.email}>
                                <FormControlLabel>
                                    <Box className="flex-row items-center gap-2">
                                        <FormControlLabelText className="text-secondary-foreground">
                                            Email Address
                                        </FormControlLabelText>
                                        <Text size="xs" className="text-secondary-foreground/50">Optional</Text>
                                    </Box>
                                </FormControlLabel>
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: 'Enter a valid email address',
                                        },
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Input className={`bg-secondary-foreground ${errors.email ? 'border-2 border-destructive' : ''}`}>
                                            <InputSlot className="pl-3">
                                                <InputIcon as={Mail} className="text-muted-foreground" />
                                            </InputSlot>
                                            <InputField
                                                placeholder="Your email.."
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                            />
                                        </Input>
                                    )}
                                />
                                <FormControlError>
                                    <FormControlErrorText>{errors.email?.message}</FormControlErrorText>
                                </FormControlError>
                            </FormControl>

                            {/* Password */}
                            <FormControl isInvalid={!!errors.password}>
                                <FormControlLabel>
                                    <FormControlLabelText className={errors.password ? 'text-destructive' : 'text-secondary-foreground'}>
                                        Password
                                    </FormControlLabelText>
                                </FormControlLabel>
                                <Controller
                                    name="password"
                                    control={control}
                                    rules={{
                                        required: 'Password is required',
                                        minLength: { value: 6, message: 'Password must be at least 6 characters' },
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Input className={`bg-secondary-foreground ${errors.password ? 'border-2 border-destructive' : ''}`}>
                                            <InputSlot className="pl-3">
                                                <InputIcon as={Lock} className="text-muted-foreground" />
                                            </InputSlot>
                                            <InputField
                                                placeholder="••••••••"
                                                secureTextEntry={!showPass}
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                            />
                                            <Button variant="ghost" onPress={() => setShowPass(!showPass)}>
                                                <ButtonIcon as={showPass ? Eye : EyeClosed} className="text-muted-foreground" />
                                            </Button>
                                        </Input>
                                    )}
                                />
                                {passwordValue ? (
                                    <Box className="mt-1 gap-1">
                                        <Box className="w-full h-1 bg-secondary-foreground/20 rounded-full overflow-hidden">
                                            <View className={`h-full rounded-full ${strength.color} ${strength.width}`} />
                                        </Box>
                                        <Text size="xs" className="text-secondary-foreground/60 text-right">{strength.label}</Text>
                                    </Box>
                                ) : null}
                                <FormControlError>
                                    <FormControlErrorText>{errors.password?.message}</FormControlErrorText>
                                </FormControlError>
                            </FormControl>

                            {/* Confirm Password */}
                            <FormControl isInvalid={!!errors.confirmPassword}>
                                <FormControlLabel>
                                    <FormControlLabelText className={errors.confirmPassword ? 'text-destructive' : 'text-secondary-foreground'}>
                                        Confirm Password
                                    </FormControlLabelText>
                                </FormControlLabel>
                                <Controller
                                    name="confirmPassword"
                                    control={control}
                                    rules={{
                                        required: 'Please confirm your password',
                                        validate: (val) => val === getValues('password') || 'Passwords do not match',
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Input className={`bg-secondary-foreground ${errors.confirmPassword ? 'border-2 border-destructive' : ''}`}>
                                            <InputSlot className="pl-3">
                                                <InputIcon as={Lock} className="text-muted-foreground" />
                                            </InputSlot>
                                            <InputField
                                                placeholder="••••••••"
                                                secureTextEntry={!showConfirm}
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                            />
                                            <Button variant="ghost" onPress={() => setShowConfirm(!showConfirm)}>
                                                <ButtonIcon as={showConfirm ? Eye : EyeClosed} className="text-muted-foreground" />
                                            </Button>
                                        </Input>
                                    )}
                                />
                                <FormControlError>
                                    <FormControlErrorText>{errors.confirmPassword?.message}</FormControlErrorText>
                                </FormControlError>
                            </FormControl>

                            <Button className="w-full py-3 bg-[#917400]" size="lg" onPress={handleNext}>
                                <ButtonText className="text-secondary-foreground text-lg">Next</ButtonText>
                            </Button>

                            <Box className="flex-row items-center justify-center gap-1">
                                <Text size="sm" className="text-secondary-foreground/60">Already have an account?</Text>
                                <Pressable onPress={() => router.push('/login')}>
                                    <Text size="sm" className="text-[#917400] font-bold">Sign in</Text>
                                </Pressable>
                            </Box>
                        </Box>
                    ) : (
                        <Box className="w-full gap-5">
                            {/* Town / Area */}
                            <FormControl isInvalid={!!errors.town}>
                                <FormControlLabel>
                                    <FormControlLabelText className={errors.town ? 'text-destructive' : 'text-secondary-foreground'}>
                                        Town / Area
                                    </FormControlLabelText>
                                </FormControlLabel>
                                <Controller
                                    name="town"
                                    control={control}
                                    rules={{ required: 'Town or area is required' }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Input className={`bg-secondary-foreground ${errors.town ? 'border-2 border-destructive' : ''}`}>
                                            <InputSlot className="pl-3">
                                                <InputIcon as={MapPin} className="text-muted-foreground" />
                                            </InputSlot>
                                            <InputField
                                                placeholder="e.g., Chelston, Lusaka"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                            />
                                        </Input>
                                    )}
                                />
                                <FormControlError>
                                    <FormControlErrorText>{errors.town?.message}</FormControlErrorText>
                                </FormControlError>
                            </FormControl>

                            {/* Date of Birth */}
                            <FormControl>
                                <FormControlLabel>
                                    <FormControlLabelText className="text-secondary-foreground">
                                        Date of Birth
                                    </FormControlLabelText>
                                </FormControlLabel>
                                <Controller
                                    name="dateOfBirth"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <DateTimePicker
                                            mode="date"
                                            value={value ? new Date(value) : undefined}
                                            onChange={(date) => onChange(date ? date.toISOString() : '')}
                                            maximumDate={new Date()}
                                            placeholder="Select date of birth"
                                            format="DD/MM/YYYY"
                                        >
                                            <DateTimePickerTrigger className="bg-secondary-foreground h-13 pl-4">
                                                <DateTimePickerIcon as={CalendarDays} className="text-muted-foreground mr-3" />
                                                <DateTimePickerInput className="text-foreground" />
                                            </DateTimePickerTrigger>
                                        </DateTimePicker>
                                    )}
                                />
                                <FormControlHelper>
                                    <FormControlHelperText className="text-secondary-foreground/60">
                                        🎁 We'll send you a birthday reward
                                    </FormControlHelperText>
                                </FormControlHelper>
                            </FormControl>

                            {/* Referral Code */}
                            <FormControl>
                                <FormControlLabel>
                                    <FormControlLabelText className="text-secondary-foreground">
                                        Referral Code
                                    </FormControlLabelText>
                                </FormControlLabel>
                                <Controller
                                    name="referralCode"
                                    control={control}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Input className="bg-secondary-foreground">
                                            <InputSlot className="pl-3">
                                                <InputIcon as={Tag} className="text-muted-foreground" />
                                            </InputSlot>
                                            <InputField
                                                placeholder="GOODTASTE2024"
                                                autoCapitalize="characters"
                                                autoCorrect={false}
                                                onChangeText={onChange}
                                                onBlur={() => { onBlur(); checkReferral(value) }}
                                                value={value}
                                            />
                                            {referralStatus === 'valid' && (
                                                <InputSlot className="pr-3">
                                                    <InputIcon as={CheckCircle2} className="text-green-500" />
                                                </InputSlot>
                                            )}
                                        </Input>
                                    )}
                                />
                                {referralStatus === 'valid' && (
                                    <Text size="xs" className="text-green-500 mt-1">Code applied successfully.</Text>
                                )}
                                {referralStatus === 'invalid' && (
                                    <Text size="xs" className="text-destructive mt-1">Invalid referral code.</Text>
                                )}
                            </FormControl>

                            <Button
                                className="w-full py-3 bg-[#917400]"
                                size="lg"
                                disabled={isSubmitting}
                                onPress={handleSubmit(handleRegister)}
                            >
                                {isSubmitting ? (
                                    <>
                                        <ButtonSpinner color="white" />
                                        <ButtonText className="text-secondary-foreground text-lg">Please wait...</ButtonText>
                                    </>
                                ) : (
                                    <>
                                        <ButtonText className="text-secondary-foreground text-lg">Create Account</ButtonText>
                                        <ButtonIcon as={ArrowRight} className="text-secondary-foreground" />
                                    </>
                                )}
                            </Button>

                            <Pressable onPress={() => setStep(1)} className="items-center">
                                <Text size="sm" className="text-secondary-foreground/60">Back to Step 1</Text>
                            </Pressable>

                            <Text size="xs" className="text-center text-secondary-foreground/40 px-4">
                                By creating an account, you agree to our{' '}
                                <Text size="xs" className="text-[#917400]">Terms of Service</Text>
                                {' '}and{' '}
                                <Text size="xs" className="text-[#917400]">Privacy Policy</Text>.
                            </Text>
                        </Box>
                    )}
                </Box>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}