import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import { AuthRoute, customAxios } from '../axios/index'

// const articlesUrl = 'http://localhost:9000/api/articles'
// const loginUrl = 'http://localhost:9000/api/login'
// const baseUrl = 'http://localhost:9000/api'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate("/") }
  // const redirectToArticles = () => { navigate("/articles") }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    if(localStorage.getItem('token')){
      localStorage.removeItem("token")
      setMessage("Goodbye!")
    }
    return redirectToLogin()
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage("")
    setSpinnerOn(true)
    customAxios().post('/login', {username, password})
      .then(res => {
        // console.log("Login Success:",res.data.message)
        localStorage.setItem("token", res.data.token)
        setMessage(res.data.message)
        // console.log("Login success message state:", message)
        setSpinnerOn(false)
        navigate("/articles")
      })
      .catch(err => console.error({err}))
    }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setMessage("")
    setSpinnerOn(true)
    customAxios().get('/articles')
      .then(res => {
        // console.log(res.data.articles)
        setArticles(res.data.articles)
        // console.log("Current articles:", articles)
        setMessage(res.data.message)
        setSpinnerOn(false)
      })
      .catch(err => {
        console.error({err})
        redirectToLogin()
      })
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    customAxios().post('/articles', article)
      .then(res => {
        console.log(res)
        setMessage(res.data.message)
        setArticles([...articles, res.data.article])
      })
      .catch(err => {
        console.error({err})
        setMessage(err.response.data.message)
      })
  }



  const updateArticle = ( article_id, article ) => {
    // ✨ implement
    // You got this!
    console.log(article_id, article)
    customAxios().put(`/articles/${article_id}`, article)
      .then(res => {
        // console.log(res)
        setMessage(res.data.message)
        setArticles(articles.map(art => {
          if(art.article_id === res.data.article.article_id){
            return res.data.article
          } else{
            return art
          }
        }))
        setCurrentArticleId(null)
      })
      .catch(err => console.error({err}))
  }

  const deleteArticle = article_id => {
    // ✨ implement
    customAxios().delete(`/articles/${article_id}`)
      .then(res => {
        console.log(res)
        setMessage(res.data.message)
        articles.filter(a => a.article_id != article_id)
      })
      .catch(err => console.error({err}))
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="/articles" element={
            <AuthRoute>
              <ArticleForm postArticle={postArticle} updateArticle={updateArticle} currentArticle={articles.find(a => a.article_id === currentArticleId)} setCurrentArticleId={setCurrentArticleId}/>
              <Articles articles={articles} getArticles={getArticles} deleteArticle={deleteArticle} currentArticleId={currentArticleId} setCurrentArticleId={setCurrentArticleId}/>
            </AuthRoute>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
