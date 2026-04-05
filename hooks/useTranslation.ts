import { usePatientStore } from '@/store/patientStore'
import { translations, TranslationType } from '@/locales/translations'

export function useTranslation() {
  const { language } = usePatientStore()
  
  // Cast to handles potential missing keys gracefully during dev
  const t = (translations[language] || translations.en) as TranslationType
  
  return { t, language }
}
