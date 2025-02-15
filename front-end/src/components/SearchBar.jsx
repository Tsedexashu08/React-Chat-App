import React from 'react'
import style from '../css/components/SearchBar.module.css'
import HamburgerMenu from './buttons/HamburgerMenu'
import { Link } from 'react-router-dom'

function SearchBar() {

  const id = parseInt(sessionStorage.getItem('auth_id'),10)
  return (
    <div className={style.searchBar}>
      <div className={style.searchbar}>
        <Link to={`profile/${id}`}>
          <HamburgerMenu />
        </Link>
        <input type="text" placeholder='  search' />
      </div>
    </div>
  )
}

export default SearchBar
