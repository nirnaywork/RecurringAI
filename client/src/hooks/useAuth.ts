import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading: false, // Always return false for loading in local mode
    isAuthenticated: true, // Always return true for local mode
  };
}
