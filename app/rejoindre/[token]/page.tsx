import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Header } from "@/app/components/Header";
import { acceptInvitation } from "@/app/actions";

type Props = {
  params: Promise<{ token: string }>;
};

export const metadata = {
  title: "Rejoindre un débrief — Cairn",
};

export default async function RejoindreInvitationPage({ params }: Props) {
  const { token } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/connexion?callbackUrl=/rejoindre/${token}`);
  }

  const result = await acceptInvitation(token);

  if ("slug" in result) {
    redirect(`/d/${result.slug}`);
  }

  return (
    <div className="wrap">
      <Header />
      <main className="connexion-main">
        <div className="connexion-card">
          <div className="connexion-header">
            <p className="eyebrow">Invitation</p>
            <h1 className="section-title">Lien invalide</h1>
            <p className="body-text">{result.error}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
