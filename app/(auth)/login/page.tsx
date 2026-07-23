'use client'
import { useState , Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image';
import {
  Box, Card, TextField, Button, Typography,
  CircularProgress, InputAdornment, IconButton, Fade, Alert
} from '@mui/material'
import {
  Visibility, VisibilityOff, LockOutlined,
  EmailOutlined, ShieldOutlined, AutoGraphOutlined
} from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { authAPI } from '@/lib/api'
import useAuthStore from '@/store/authStore'

// export default function LoginPage()
function LoginContent() {
  const router          = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const setPendingEmail = useAuthStore((s) => s.setPendingEmail)

  const searchParams = useSearchParams()
  const raison       = searchParams.get('raison')

  const [form, setForm]         = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  
  try {
    await authAPI.login(form)
    setPendingEmail(form.email) 
    enqueueSnackbar('Code de vérification envoyé à votre adresse email.', { variant: 'info' })
    router.push('/verify-otp')
  } catch (err: unknown) {
    const e = err as { response?: { data?: { detail?: string } } }
    const msg = e.response?.data?.detail || 'Identifiants incorrects.'
    enqueueSnackbar(msg, { variant: 'error' })
  } finally {
    setLoading(false)
  }
}
  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#061a14',
      backgroundImage: `
        radial-gradient(circle at 10% 20%, rgba(16, 185, 129, 0.12) 0%, transparent 50%),
        radial-gradient(circle at 90% 80%, rgba(15, 23, 42, 0.25) 0%, transparent 50%)
      `,
      p: 2,
    }}>
      <Fade in timeout={1000}>
        <Card sx={{
          display: 'flex',
          width: '100%',
          maxWidth: 1050,
          minHeight: 620,
          borderRadius: 4,
          boxShadow: '0 30px 60px -15px rgba(0,0,0,0.7)',
          overflow: 'hidden',
          border: '1px solid rgba(16,185,129,0.08)',
          background: 'rgba(8, 24, 20, 0.7)',
          backdropFilter: 'blur(20px)',
        }}>

          {/* ── PANNEAU GAUCHE : Branding Digital & Immersif ── */}
          <Box sx={{
            width: { xs: 0, md: '45%' },
            background: 'linear-gradient(135deg, #06241b 0%, #0d1b2a 100%)',
            color: 'white',
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            p: 6,
            justifyContent: 'space-between',
            borderRight: '1px solid rgba(16,185,129,0.08)',
          }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 6 }}>
                <Box sx={{
                  p: 1.2, borderRadius: 2, bgcolor: '#059669',
                  display: 'flex', boxShadow: '0 0 25px rgba(5,150,105,0.4)',
                }}>
                  <ShieldOutlined sx={{ fontSize: 10}} />
                </Box>
                <Image 
                src="/kenaya.png" 
                alt="Logo PRESF" 
                width={80}  
                height={80} 
                style={{ 
                  borderRadius: '50%',      
                  backgroundColor: '#FFFFFF', 
                  objectFit: 'cover',       
                  border: '2px solid #f1f5f9' 
                }} 
              />
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '0.5px' }}>
                ArchiviS
              </Typography>
              </Box>
              
              <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.3, mb: 2, letterSpacing: '-0.5px' }}>
                L&apos;intelligence au service de vos archives.
              </Typography>
              <Typography sx={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Plateforme centralisée de gestion des flux et de conformité documentaire réglementaire.
              </Typography>
            </Box>

            <Box sx={{
              bgcolor: 'rgba(255,255,255,0.02)', p: 3, borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.04)',
            }}>
              <Box sx={{ display: 'flex', gap: 1.5, mb: 1, alignItems: 'center' }}>
                <AutoGraphOutlined sx={{ color: '#10b981', fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#f1f5f9' }}>
                  Statistiques et Traçabilité
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', lineHeight: 1.4 }}>
                Suivez chaque modification et statut de complétude d&apos;agence avec une précision chirurgicale.
              </Typography>
            </Box>
          </Box>

          {/* ── PANNEAU DROIT : Formulaire Cyber-Sûr ── */}
          <Box sx={{
            width: { xs: '100%', md: '55%' },
            bgcolor: '#081612',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: { xs: 4, md: 8 },
          }}>
            <Box sx={{ width: '100%', maxWidth: 380, mx: 'auto' }}>
              
              {raison === 'inactivite' && (
                <Alert 
                  severity="warning" 
                  variant="outlined"
                  sx={{ 
                    mb: 4, 
                    borderRadius: 2, 
                    color: '#f59e0b', 
                    borderColor: 'rgba(245, 158, 11, 0.3)',
                    bgcolor: 'rgba(245, 158, 11, 0.05)'
                  }}
                >
                  Session expirée après 30 minutes d&apos;inactivité.
                </Alert>
              )}

              <Box sx={{ mb: 5 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc', mb: 1, letterSpacing: '-0.5px' }}>
                  Connexion
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Renseignez vos accès sécurisés pour accéder au portail.
                </Typography>
              </Box>

              <form onSubmit={handleSubmit}>
                <Typography variant="caption" sx={{ fontWeight: 600, ml: 0.5, mb: 1, display: 'block', color: '#94a3b8', letterSpacing: '0.5px' }}>
                  ADRESSE EMAIL
                </Typography>
                <TextField
                  fullWidth name="email"
                  placeholder="nom@entreprise.com"
                  variant="outlined"
                  value={form.email}
                  onChange={handleChange}
                  required
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(13, 30, 42, 0.6)', 
                      borderRadius: 2.5,
                      color: '#f8fafc',
                      '& fieldset': { borderColor: 'rgba(16,185,129,0.12)' },
                      '&:hover fieldset': { borderColor: 'rgba(16,185,129,0.3)' },
                      '&.Mui-focused fieldset': { borderColor: '#10b981' },
                    },
                  }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlined sx={{ fontSize: 18, color: '#64748b' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Typography variant="caption" sx={{ fontWeight: 600, ml: 0.5, mb: 1, display: 'block', color: '#94a3b8', letterSpacing: '0.5px' }}>
                  MOT DE PASSE
                </Typography>
                <TextField
                  fullWidth name="password"
                  type={showPass ? 'text' : 'password'}
                  variant="outlined"
                  value={form.password}
                  onChange={handleChange}
                  required
                  sx={{
                    mb: 5,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(13, 30, 42, 0.6)', 
                      borderRadius: 2.5,
                      color: '#f8fafc',
                      '& fieldset': { borderColor: 'rgba(16,185,129,0.12)' },
                      '&:hover fieldset': { borderColor: 'rgba(16,185,129,0.3)' },
                      '&.Mui-focused fieldset': { borderColor: '#10b981' },
                    },
                  }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined sx={{ fontSize: 18, color: '#64748b' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPass(!showPass)} edge="end" sx={{ color: '#64748b' }}>
                            {showPass ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Button
                  type="submit" fullWidth variant="contained"
                  disabled={loading}
                  sx={{
                    py: 1.8, 
                    borderRadius: 2.5,
                    bgcolor: '#059669',
                    color: '#ffffff',
                    textTransform: 'none',
                    fontSize: '0.95rem', 
                    fontWeight: 700,
                    boxShadow: '0 4px 20px rgba(5, 150, 105, 0.3)',
                    '&:hover': { 
                      bgcolor: '#047857',
                      boxShadow: '0 6px 25px rgba(5, 150, 105, 0.4)',
                    },
                    '&.Mui-disabled': {
                      bgcolor: 'rgba(5, 150, 105, 0.3)',
                      color: 'rgba(255,255,255,0.5)'
                    }
                  }}
                >
                  {loading
                    ? <CircularProgress size={22} color="inherit" />
                    : 'Continuer l\'authentification'
                  }
                </Button>
              </form>

              <Typography variant="body2" align="center" sx={{ mt: 5, color: '#64748b', fontSize: '0.85rem' }}>
                Un problème de connexion ?{' '}
                <span style={{ color: '#10b981', cursor: 'pointer', fontWeight: 600 }}>
                  Contacter l&apos;administrateur
                </span>
              </Typography>
            </Box>
          </Box>
        </Card>
      </Fade>
    </Box>
  )
}


export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  )
}