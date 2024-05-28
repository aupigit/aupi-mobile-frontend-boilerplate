import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUser } from '@/contexts/UserContext'
import { doLogin } from '@/services/authenticate/authenticate'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useToast } from 'native-base';
import { ScrollView, Text, View } from 'react-native'
import FormControl from './FormControl'
import { formatDate } from '@/utils/Dates'
import { format } from 'date-fns'

const authSchema = z.object({
  email: z
    .string({
      required_error: 'Email é obrigatório',
      invalid_type_error: 'Email precisa ser uma string',
    })
    .min(2, 'Email precisa ter pelo menos 2 caracteres')
    .email('Email precisa ser um email válido'),

  password: z
    .string({
      required_error: 'Senha é obrigatório',
      invalid_type_error: 'Senha precisa ser uma string',
    })
    .min(8, 'Senha precisa ter pelo menos 8 caracteres'),
})

export type AuthFormData = z.infer<typeof authSchema>

const Login = () => {
  const { loginUser } = useUser()
  const Toast = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  })


  const onSubmit = handleSubmit(async (data) => {
    try {
      setButtonLoading(true)

      const response = await doLogin(data.email, data.password)

      if (response && response.user) {

        router.replace('/login/applicatorCpfVerificate')
        loginUser(response.user)
        Toast.show({
          title: 'Usuário logado com sucesso.',
          duration: 3000,
          placement: 'bottom',
          style: { backgroundColor: '#0AC800' },
        })
      }
    } catch (error) {
      Toast.show({
        title: 'Login falhou! Verifique suas credenciais.',
        duration: 3000,
        placement: 'bottom',
        style: { backgroundColor: '#ff0000' },
      })
    } finally {
      setButtonLoading(false)
    }
  })


  return (
    <ScrollView className="flex-1">
      <View className="h-screen flex-1 bg-white container">
        <View className="flex-1 justify-center gap-5">
          <Text className="text-4xl font-bold text-black">
            Realizar Login
          </Text>
          <Text className="text-xl text-black">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt dicta laudantium
          </Text>
          <Text className=' text-xs text-zinc-700/50'>
            {formatDate(new Date(), { isNormalDate: true })}
          </Text>
          <FormControl
            buttonLoading={buttonLoading}
            control={control}
            errors={errors}
            onSubmit={onSubmit}
            setShowPassword={setShowPassword}
            showPassword={showPassword}
          />
        </View>
      </View>
    </ScrollView>
  )
}

export default Login
