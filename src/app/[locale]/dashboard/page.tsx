"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { BookOpen, Sparkles, Users, Crown, Clock, ArrowRight } from "lucide-react";
import { MetaphorIcon } from "@/components/icons/MetaphorIcon";

import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface UserProfile {
  id: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
  subscriptionTier: string;
  subscriptionStatus: string | null;
  createdAt: string | null;
}

interface ReadingEntry {
  id: string;
  type: string;
  birthDate: string;
  birthTime: string | null;
  gender: string;
  dayMasterMetaphor: string | null;
  overallScore: number | null;
  createdAt: string;
}

interface ReadingsResponse {
  readings: ReadingEntry[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const tNav = useTranslations("nav");
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [readings, setReadings] = useState<ReadingEntry[]>([]);
  const [totalReadings, setTotalReadings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, readingsRes] = await Promise.all([
          fetch("/api/user/profile"),
          fetch("/api/user/readings?limit=10"),
        ]);

        if (profileRes.ok) {
          const profileData: UserProfile = await profileRes.json();
          setProfile(profileData);
        }

        if (readingsRes.ok) {
          const readingsData: ReadingsResponse = await readingsRes.json();
          setReadings(readingsData.readings);
          setTotalReadings(readingsData.pagination.total);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <main className="flex flex-col items-center min-h-screen px-4">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-text-secondary">{t("loading")}</div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center min-h-screen px-4">
      <NavBar />

      <div className="w-full max-w-5xl py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary font-[family-name:var(--font-heading)]">
            {t("title")}
          </h1>
          <p className="text-text-secondary mt-1">
            {profile?.name
              ? t("welcomeBack", { name: profile.name })
              : t("welcome")}
          </p>
        </div>

        {/* Subscription Status Card */}
        <Card glow={profile?.subscriptionTier === "premium"}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6 text-gold-400" />
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  {t("subscription.title")}
                </h2>
                <p className="text-sm text-text-secondary">
                  {profile?.subscriptionTier === "premium"
                    ? t("subscription.premium")
                    : profile?.subscriptionTier === "detailed"
                      ? t("subscription.detailed")
                      : t("subscription.free")}
                </p>
              </div>
            </div>
            {profile?.subscriptionTier === "free" && (
              <Button
                variant="gold"
                size="sm"
                onClick={() => router.push("/pricing")}
              >
                {t("subscription.upgrade")}
              </Button>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:border-purple-500/30 transition-colors" onClick={() => router.push("/")}>
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <div>
                <p className="font-semibold text-text-primary text-sm">{t("actions.newReading")}</p>
                <p className="text-xs text-text-muted">{t("actions.newReadingDesc")}</p>
              </div>
            </div>
          </Card>

          <Card className="cursor-pointer hover:border-purple-500/30 transition-colors" onClick={() => router.push("/")}>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-purple-400" />
              <div>
                <p className="font-semibold text-text-primary text-sm">{t("actions.compatibility")}</p>
                <p className="text-xs text-text-muted">{t("actions.compatibilityDesc")}</p>
              </div>
            </div>
          </Card>

          <Card className="cursor-pointer hover:border-purple-500/30 transition-colors" onClick={() => router.push("/pricing")}>
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <div>
                <p className="font-semibold text-text-primary text-sm">{t("actions.fullReading")}</p>
                <p className="text-xs text-text-muted">{t("actions.fullReadingDesc")}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Reading History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-text-primary">
              {t("history.title")}
            </h2>
            <span className="text-sm text-text-muted">
              {t("history.total", { count: totalReadings })}
            </span>
          </div>

          {readings.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <Sparkles className="w-12 h-12 text-purple-500/30 mx-auto mb-4" />
                <p className="text-text-secondary mb-4">{t("history.empty")}</p>
                <Button onClick={() => router.push("/")}>
                  {t("history.getStarted")}
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {readings.map((reading) => (
                <Card
                  key={reading.id}
                  className="cursor-pointer hover:border-purple-500/30 transition-colors"
                  onClick={() => router.push(`/reading/${reading.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <MetaphorIcon metaphor={reading.dayMasterMetaphor || ""} size={32} />
                      <div>
                        <p className="font-semibold text-text-primary text-sm">
                          {reading.dayMasterMetaphor
                            ? t(`history.metaphor.${reading.dayMasterMetaphor}`)
                            : t("history.reading")}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                          <span className="capitalize">{reading.type}</span>
                          <span>&middot;</span>
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(reading.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-muted" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}


function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}
