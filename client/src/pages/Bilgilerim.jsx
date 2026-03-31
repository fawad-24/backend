import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../context/TranslationContext";
import { UI_TEXT } from "../config/uiText";

export default function Bilgilerim() {
  const { user, loading } = useAuth();
   const { t } = useTranslation();

  if (loading) return <div className="p-8">{t(UI_TEXT.loading)}</div>;
  if (!user) return <div className="p-8">{t(UI_TEXT.mustLogin)}</div>;

  return (
    <div className="mt-40 max-w-3xl mx-auto p-24 bg-slate-200 shadow rounded-3xl">
      <h1 className="text-2xl font-bold mb-6 text-center">👤 {t(UI_TEXT.myInfo)}</h1>

      <div className="space-y-3 py-1">
        <p className="bg-slate-50 rounded-3xl shadow px-2 py-1"><b>{t(UI_TEXT.firstName)}:</b> {user.firstName}</p>
        <p className="bg-slate-50 rounded-3xl shadow px-2 py-1"><b>{t(UI_TEXT.lastName)}:</b> {user.lastName}</p>
        <p className="bg-slate-50 rounded-3xl shadow px-2 py-1"><b>{t(UI_TEXT.email)}:</b> {user.email}</p>
        <p className="bg-slate-50 rounded-3xl shadow px-2 py-1"><b>{t(UI_TEXT.phone)}:</b> {user.phone || "-"}</p>
        <p className="bg-slate-50 rounded-3xl shadow px-2 py-1"><b>{t(UI_TEXT.address)}:</b> {user.address || "-"}</p>
      </div>
    </div>
  );
}
