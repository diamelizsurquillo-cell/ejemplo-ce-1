import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, User, LogIn, Eye, EyeOff, Copy, Check, ShieldCheck, Truck } from "lucide-react";

const DEMO_USER = "Administrador";
const DEMO_PASS = "CanalEjecutivo";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate network delay for realism
    await new Promise((r) => setTimeout(r, 800));

    const result = login(username, password);
    if (result.success) {
      navigate("/", { replace: true });
    } else {
      setError(result.error || "Error desconocido");
      setIsLoading(false);
    }
  };

  const handleCopy = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[hsl(222,32%,7%)]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(199 89% 48%) 1px, transparent 1px), linear-gradient(90deg, hsl(199 89% 48%) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Radial glow top-left */}
        <div className="absolute -top-[300px] -left-[300px] w-[700px] h-[700px] rounded-full bg-[hsl(199,89%,48%)] opacity-[0.07] blur-[120px]" />
        {/* Radial glow bottom-right */}
        <div className="absolute -bottom-[200px] -right-[200px] w-[500px] h-[500px] rounded-full bg-[hsl(215,28%,22%)] opacity-[0.15] blur-[100px]" />
        {/* Floating shapes */}
        <motion.div
          className="absolute top-[15%] right-[20%] w-2 h-2 rounded-full bg-[hsl(199,89%,48%)] opacity-40"
          animate={{ y: [0, -20, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[60%] left-[10%] w-1.5 h-1.5 rounded-full bg-[hsl(152,60%,42%)] opacity-30"
          animate={{ y: [0, 15, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-[25%] right-[35%] w-1 h-1 rounded-full bg-[hsl(38,92%,52%)] opacity-30"
          animate={{ y: [0, -12, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[920px] mx-4"
      >
        <div className="flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl border border-white/[0.06]"
          style={{ boxShadow: "0 25px 80px -15px rgba(0,0,0,0.6), 0 0 60px -20px hsl(199 89% 48% / 0.15)" }}
        >
          {/* Left side — Login Form */}
          <div className="flex-1 bg-[hsl(222,28%,11%)] p-8 md:p-10 lg:p-12">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(199,89%,48%)] to-[hsl(210,90%,55%)] flex items-center justify-center shadow-lg shadow-[hsl(199,89%,48%)]/20">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-display font-bold text-white tracking-tight leading-none">
                  CANAL EJECUTIVO
                </h1>
                <p className="text-xs text-[hsl(215,15%,55%)] mt-0.5">Panel de Control</p>
              </div>
            </div>

            {/* Welcome text */}
            <div className="mb-8">
              <h2 className="text-2xl font-display font-bold text-white mb-2">
                Bienvenido de vuelta
              </h2>
              <p className="text-sm text-[hsl(215,15%,55%)]">
                Ingresa tus credenciales para acceder al dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
              {/* Username */}
              <div className="space-y-2">
                <label htmlFor="login-username" className="text-xs font-medium text-[hsl(215,15%,65%)] uppercase tracking-wider">
                  Usuario
                </label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(215,15%,45%)] transition-colors group-focus-within:text-[hsl(199,89%,55%)]" />
                  <input
                    id="login-username"
                    type="text"
                    placeholder="Administrador"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(""); }}
                    className="w-full h-11 pl-10 pr-4 rounded-lg bg-[hsl(222,22%,14%)] border border-[hsl(222,22%,18%)] text-white text-sm placeholder:text-[hsl(215,15%,35%)] outline-none transition-all duration-200 focus:border-[hsl(199,89%,48%)] focus:ring-2 focus:ring-[hsl(199,89%,48%)]/20 hover:border-[hsl(222,22%,24%)]"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="login-password" className="text-xs font-medium text-[hsl(215,15%,65%)] uppercase tracking-wider">
                  Contraseña
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(215,15%,45%)] transition-colors group-focus-within:text-[hsl(199,89%,55%)]" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="CanalEjecutivo"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    className="w-full h-11 pl-10 pr-12 rounded-lg bg-[hsl(222,22%,14%)] border border-[hsl(222,22%,18%)] text-white text-sm placeholder:text-[hsl(215,15%,35%)] outline-none transition-all duration-200 focus:border-[hsl(199,89%,48%)] focus:ring-2 focus:ring-[hsl(199,89%,48%)]/20 hover:border-[hsl(222,22%,24%)]"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[hsl(215,15%,45%)] hover:text-[hsl(199,89%,55%)] transition-colors"
                    tabIndex={-1}
                    id="toggle-password-visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-[hsl(0,75%,55%)]/10 border border-[hsl(0,75%,55%)]/20 text-[hsl(0,75%,65%)] text-sm"
                      id="login-error-message"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[hsl(0,75%,55%)] shrink-0 animate-pulse" />
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || !username || !password}
                id="login-submit-button"
                className="w-full h-11 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-[hsl(199,89%,45%)] to-[hsl(210,90%,50%)] shadow-lg shadow-[hsl(199,89%,48%)]/25 transition-all duration-200 hover:shadow-xl hover:shadow-[hsl(199,89%,48%)]/30 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Iniciar Sesión
                  </>
                )}
              </button>
            </form>

            {/* Security note */}
            <div className="mt-8 flex items-center gap-2 text-[hsl(215,15%,40%)] text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Conexión segura · Sesión protegida</span>
            </div>
          </div>

          {/* Right side — Demo Credentials */}
          <div className="w-full lg:w-[320px] bg-gradient-to-br from-[hsl(215,28%,16%)] to-[hsl(215,32%,12%)] p-8 md:p-10 lg:p-12 border-t lg:border-t-0 lg:border-l border-white/[0.06] flex flex-col justify-center">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[hsl(152,60%,42%)]/10 border border-[hsl(152,60%,42%)]/20 text-[hsl(152,60%,50%)] text-[10px] font-semibold uppercase tracking-wider mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[hsl(152,60%,42%)] animate-pulse" />
                  Demo
                </div>
                <h3 className="text-base font-display font-semibold text-white mb-1">
                  Credenciales de prueba
                </h3>
                <p className="text-xs text-[hsl(215,15%,50%)] leading-relaxed">
                  Usa estas credenciales para explorar el dashboard de demostración.
                </p>
              </div>

              {/* Credential cards */}
              <div className="space-y-3">
                {/* Username credential */}
                <div className="group rounded-lg bg-[hsl(222,28%,11%)] border border-[hsl(222,22%,18%)] p-3.5 transition-all hover:border-[hsl(199,89%,48%)]/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-medium text-[hsl(215,15%,50%)] uppercase tracking-wider">
                      Usuario
                    </span>
                    <button
                      onClick={() => handleCopy(DEMO_USER, "user")}
                      className="flex items-center gap-1 text-[10px] text-[hsl(199,89%,55%)] hover:text-[hsl(199,89%,65%)] transition-colors"
                      id="copy-demo-username"
                    >
                      {copiedField === "user" ? (
                        <><Check className="w-3 h-3" /> ¡Copiado!</>
                      ) : (
                        <><Copy className="w-3 h-3" /> Copiar</>
                      )}
                    </button>
                  </div>
                  <p className="text-sm font-mono font-semibold text-white select-all">
                    {DEMO_USER}
                  </p>
                </div>

                {/* Password credential */}
                <div className="group rounded-lg bg-[hsl(222,28%,11%)] border border-[hsl(222,22%,18%)] p-3.5 transition-all hover:border-[hsl(199,89%,48%)]/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-medium text-[hsl(215,15%,50%)] uppercase tracking-wider">
                      Contraseña
                    </span>
                    <button
                      onClick={() => handleCopy(DEMO_PASS, "pass")}
                      className="flex items-center gap-1 text-[10px] text-[hsl(199,89%,55%)] hover:text-[hsl(199,89%,65%)] transition-colors"
                      id="copy-demo-password"
                    >
                      {copiedField === "pass" ? (
                        <><Check className="w-3 h-3" /> ¡Copiado!</>
                      ) : (
                        <><Copy className="w-3 h-3" /> Copiar</>
                      )}
                    </button>
                  </div>
                  <p className="text-sm font-mono font-semibold text-white select-all">
                    {DEMO_PASS}
                  </p>
                </div>
              </div>

              {/* Quick fill hint */}
              <p className="text-[11px] text-[hsl(215,15%,40%)] leading-relaxed">
                💡 <span className="text-[hsl(215,15%,50%)]">Tip:</span> Copia y pega las credenciales o escríbelas directamente en el formulario.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center text-[11px] text-[hsl(215,15%,30%)] mt-6"
        >
          © 2026 Canal Ejecutivo · Dashboard de Logística
        </motion.p>
      </motion.div>
    </div>
  );
}
