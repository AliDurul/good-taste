import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native'
import * as Location from 'expo-location'
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
import {
    Select,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectIcon,
    SelectInput,
    SelectItem,
    SelectPortal,
    SelectTrigger,
} from '@/components/ui/select'
import { Progress, ProgressFilledTrack } from '@/components/ui/progress'
import { DateTimePicker, DateTimePickerInput, DateTimePickerTrigger, DateTimePickerIcon } from '@/components/ui/date-time-picker'
import { useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignUpForm, signUpSchema } from '@/zod/auth'
import {
    ArrowRight,
    CalendarDays,
    ChevronDown,
    Crosshair,
    Eye,
    EyeClosed,
    Globe,
    Lock,
    Mail,
    MapPin,
    User,
} from 'lucide-react-native'
import { authClient } from '@/lib/auth-client'
import useAppToast from '@/hooks/useAppToast'

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

const COUNTRIES = ['Zambia', 'Zimbabwe', 'Malawi', 'Tanzania']
const CITIES = ['Lusaka', 'Ndola', 'Kitwe', 'Livingstone']

export default function Register() {
    const router = useRouter();
    const toast = useAppToast();
    const [step, setStep] = useState<1 | 2>(1)
    const [showPass, setShowPass] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [locating, setLocating] = useState(false)
    const [locationError, setLocationError] = useState<string | null>(null)
    const [address, setAddress] = useState<string | null>(null)

    const {
        control,
        handleSubmit,
        trigger,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<SignUpForm>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: '',
            phone: '',
            email: '',
            password: '',
            confirmPassword: '',
            country: '',
            city: '',
            town: '',
            // location: undefined,
            birthday: '',
        },
    })

    const passwordValue = watch('password')
    const strength = getPasswordStrength(passwordValue)

    const handleNext = async () => {
        const valid = await trigger(['name', 'phone', 'password', 'confirmPassword'])
        if (valid) setStep(2)
    }

    const handleRegister = async (data: SignUpForm) => {
        console.log('Register:', data)
        const { error } = await authClient.signUp.email({
            name: data.name,
            phone: data.phone,
            email: data.email,
            password: data.password,
            country: data.country,
            city: data.city,
            town: data.town,
            birthday: data.birthday ,
            address: 'phi',
        });

        if (error) {
            console.error('Login error:', error);
            toast.error(error.message ?? 'Registration failed', { title: 'Registration failed' });
            return;
        }

        router.replace("/");
    }

    const captureLocation = async (
        onChange: (value: { latitude: number; longitude: number }) => void,
    ) => {
        setLocationError(null)
        setLocating(true)
        try {
            const { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') {
                setLocationError('Location permission denied. Please enable it in settings.')
                return
            }
            const pos = await Location.getCurrentPositionAsync({})
            const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude }
            console.log('Location permission status:', coords)

            onChange(coords)

            try {
                const [place] = await Location.reverseGeocodeAsync(coords)
                console.log('Reverse geocoded place:', place)
                if (place) {
                    setAddress(
                        [place.name, place.street, place.city, place.country]
                            .filter(Boolean)
                            .join(', '),
                    )
                }
            } catch {
                // reverse geocoding is best-effort; coords are still captured
            }
        } catch {
            setLocationError('Could not get your location. Please try again.')
        } finally {
            setLocating(false)
        }
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
                            <ProgressFilledTrack className="bg-primary" />
                        </Progress>
                    </Box>

                    {step === 1 ? (
                        <Box className="w-full gap-5">
                            {/* Full Name */}
                            <FormControl isInvalid={!!errors.name}>
                                <FormControlLabel>
                                    <FormControlLabelText className={errors.name ? 'text-destructive' : 'text-secondary-foreground'}>
                                        Full Name
                                    </FormControlLabelText>
                                </FormControlLabel>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Input className={`bg-secondary-foreground ${errors.name ? 'border-2 border-destructive' : ''}`}>
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
                                    <FormControlErrorText>{errors.name?.message}</FormControlErrorText>
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

                            {/* Email */}
                            <FormControl isInvalid={!!errors.email}>
                                <FormControlLabel>
                                    <FormControlLabelText className={errors.email ? 'text-destructive' : 'text-secondary-foreground'}>
                                        Email Address
                                    </FormControlLabelText>
                                </FormControlLabel>
                                <Controller
                                    name="email"
                                    control={control}
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

                            <Button className="w-full py-3 bg-primary" size="lg" onPress={handleNext}>
                                <ButtonText className="text-secondary-foreground text-lg">Next</ButtonText>
                            </Button>

                            <Box className="flex-row items-center justify-center gap-1">
                                <Text size="sm" className="text-secondary-foreground/60">Already have an account?</Text>
                                <Pressable onPress={() => router.push('/login')}>
                                    <Text size="sm" className="text-primary font-bold">Sign in</Text>
                                </Pressable>
                            </Box>
                        </Box>
                    ) : (
                        <Box className="w-full gap-5">
                            {/* Country */}
                            <FormControl isInvalid={!!errors.country}>
                                <FormControlLabel>
                                    <FormControlLabelText className={errors.country ? 'text-destructive' : 'text-secondary-foreground'}>
                                        Country
                                    </FormControlLabelText>
                                </FormControlLabel>
                                <Controller
                                    name="country"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <Select selectedValue={value} onValueChange={onChange}>
                                            <SelectTrigger size={'lg'} className={`bg-secondary-foreground ${errors.country ? 'border-2 border-destructive' : ''}`}>
                                                <SelectInput placeholder="Select country" className="flex-1" />
                                                <SelectIcon as={ChevronDown} className="mr-3 text-muted-foreground" />
                                            </SelectTrigger>
                                            <SelectPortal>
                                                <SelectBackdrop />
                                                <SelectContent>
                                                    <SelectDragIndicatorWrapper>
                                                        <SelectDragIndicator />
                                                    </SelectDragIndicatorWrapper>
                                                    {COUNTRIES.map((c) => (
                                                        <SelectItem key={c} label={c} value={c} />
                                                    ))}
                                                </SelectContent>
                                            </SelectPortal>
                                        </Select>
                                    )}
                                />
                                <FormControlError>
                                    <FormControlErrorText>{errors.country?.message}</FormControlErrorText>
                                </FormControlError>
                            </FormControl>

                            {/* City */}
                            <FormControl isInvalid={!!errors.city}>
                                <FormControlLabel>
                                    <FormControlLabelText className={errors.city ? 'text-destructive' : 'text-secondary-foreground'}>
                                        City
                                    </FormControlLabelText>
                                </FormControlLabel>
                                <Controller
                                    name="city"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <Select selectedValue={value} onValueChange={onChange}>
                                            <SelectTrigger size={'lg'} className={`bg-secondary-foreground ${errors.city ? 'border-2 border-destructive' : ''}`}>
                                                <SelectInput placeholder="Select city" className="flex-1" />
                                                <SelectIcon as={ChevronDown} className="mr-3 text-muted-foreground" />
                                            </SelectTrigger>
                                            <SelectPortal>
                                                <SelectBackdrop />
                                                <SelectContent>
                                                    <SelectDragIndicatorWrapper>
                                                        <SelectDragIndicator />
                                                    </SelectDragIndicatorWrapper>
                                                    {CITIES.map((c) => (
                                                        <SelectItem key={c} label={c} value={c} />
                                                    ))}
                                                </SelectContent>
                                            </SelectPortal>
                                        </Select>
                                    )}
                                />
                                <FormControlError>
                                    <FormControlErrorText>{errors.city?.message}</FormControlErrorText>
                                </FormControlError>
                            </FormControl>

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

                            {/* Map location */}
                            {/* <FormControl isInvalid={!!errors.location}>
                                <FormControlLabel>
                                    <FormControlLabelText className={errors.location ? 'text-destructive' : 'text-secondary-foreground'}>
                                        Map Location
                                    </FormControlLabelText>
                                </FormControlLabel>
                                <Controller
                                    name="location"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <Box className="gap-2">
                                            <Button
                                                variant="outline"
                                                className={`w-full h-13 justify-start bg-secondary-foreground ${errors.location ? 'border-2 border-destructive' : ''}`}
                                                disabled={locating}
                                                onPress={() => captureLocation(onChange)}
                                            >
                                                {locating ? (
                                                    <ButtonSpinner className="text-primary" />
                                                ) : (
                                                    <ButtonIcon as={value ? Globe : Crosshair} className="text-primary" />
                                                )}
                                                <ButtonText className="text-foreground text-base">
                                                    {value ? 'Update my location' : 'Use my current location'}
                                                </ButtonText>
                                            </Button>
                                            {value ? (
                                                <Box className="rounded-md bg-secondary-foreground/10 px-3 py-2 gap-0.5">
                                                    <Text selectable size="sm" className="text-secondary-foreground font-medium">
                                                        {value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}
                                                    </Text>
                                                    {address ? (
                                                        <Text size="xs" className="text-secondary-foreground/60">{address}</Text>
                                                    ) : null}
                                                </Box>
                                            ) : null}
                                        </Box>
                                    )}
                                />
                                {locationError && (
                                    <FormControlHelper>
                                        <FormControlHelperText className="text-destructive">{locationError}</FormControlHelperText>
                                    </FormControlHelper>
                                )}
                                <FormControlError>
                                    <FormControlErrorText>{errors.location?.message}</FormControlErrorText>
                                </FormControlError>
                            </FormControl> */}

                            {/* Date of Birth */}
                            <FormControl>
                                <FormControlLabel>
                                    <FormControlLabelText className="text-secondary-foreground">
                                        Date of Birth
                                    </FormControlLabelText>
                                </FormControlLabel>
                                <Controller
                                    name="birthday"
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

                            <Button
                                className="w-full py-3 bg-primary"
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
                                <Text size="xs" className="text-primary">Terms of Service</Text>
                                {' '}and{' '}
                                <Text size="xs" className="text-primary">Privacy Policy</Text>.
                            </Text>
                        </Box>
                    )}
                </Box>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}
