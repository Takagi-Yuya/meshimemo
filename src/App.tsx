import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useRecipes } from '@/hooks/useRecipes'
import { useCookLogs } from '@/hooks/useCookLogs'
import { useHousehold } from '@/hooks/useHousehold'
import { Header } from '@/components/layout/Header'
import { Login } from '@/pages/Login'
import { Home } from '@/pages/Home'
import { RecipeNew } from '@/pages/RecipeNew'
import { RecipeDetail } from '@/pages/RecipeDetail'
import { Suggestion } from '@/pages/Suggestion'
import { Calendar } from '@/pages/Calendar'
import { Settings } from '@/pages/Settings'

function AppContent() {
  const { user, loading: authLoading, login, logout } = useAuth()
  const { household, createHousehold, joinHousehold } =
    useHousehold(user?.householdId ?? null)
  const { recipes, loading: recipesLoading, addRecipe, updateRecipe, deleteRecipe, markCooked } =
    useRecipes(user?.householdId ?? null)
  const { cookLogs, addCookLog, deleteCookLog, updateCookLog } = useCookLogs(user?.householdId ?? null)

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    )
  }

  if (!user) {
    return <Login onLogin={login} />
  }

  // 世帯未設定 → 設定画面へ
  if (!user.householdId) {
    return (
      <div>
        <Header />
        <Settings
          user={user}
          household={null}
          onLogout={logout}
          onCreateHousehold={(name) => createHousehold(name, user.id)}
          onJoinHousehold={(code) => joinHousehold(code, user.id)}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <Header />
      <Routes>
        <Route
          path="/"
          element={<Home recipes={recipes} loading={recipesLoading} />}
        />
        <Route
          path="/recipe/new"
          element={<RecipeNew user={user} addRecipe={addRecipe} />}
        />
        <Route
          path="/recipe/:id"
          element={
            <RecipeDetail
              user={user}
              recipes={recipes}
              cookLogs={cookLogs}
              updateRecipe={updateRecipe}
              deleteRecipe={deleteRecipe}
              markCooked={markCooked}
              addCookLog={addCookLog}
              deleteCookLog={deleteCookLog}
              updateCookLog={updateCookLog}
            />
          }
        />
        <Route path="/suggestion" element={<Suggestion recipes={recipes} />} />
        <Route
          path="/calendar"
          element={<Calendar cookLogs={cookLogs} recipes={recipes} />}
        />
        <Route
          path="/settings"
          element={
            <Settings
              user={user}
              household={household}
              onLogout={logout}
              onCreateHousehold={(name) => createHousehold(name, user.id)}
              onJoinHousehold={(code) => joinHousehold(code, user.id)}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
