import React, {useState, useEffect, useMemo} from "react";
import debounce from "lodash.debounce";
import {
  Form,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormInput,
  Button,
  Collapse,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  FormRadio
} from "shards-react";
import User from "../../../services/users";
import Blog from "../../../services/blogs";
import { Link } from "react-router-dom";

const NavbarSearch = () => {
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [filterList, setFilterList] = useState({ selected: "all" })
  const [results, setResults] = useState({
    users: [],
    posts: []
  })

  const handleChange = (e) => {
    setSearchValue(e.target.value)
  }

  const fetchData = () => {
    if(!searchValue){
      setResults({...results, users: [], posts: []})
      return null
    }

    if(filterList.selected === "all"){
      User.userSearch(searchValue, 3).then(deatils => {
        Blog.blogSearch(searchValue, 2).then(detailsNI => {
          setResults({...results, users: deatils, posts: detailsNI})
        })
      })
    }
    else if(filterList.selected === "authors"){
      User.userSearch(searchValue, 6).then(deatils => {
        setResults({...results, posts: [], users: deatils})
      })
    }
    else {
      Blog.blogSearch(searchValue, 3).then(deatils => {
        setResults({...results, users: [], posts: deatils})
      })
    }
  }

  const debounceResults = useMemo(() => {
    return debounce(handleChange, 500)
  }, [])

  useEffect(() => {
    fetchData()
    return () => debounceResults.cancel()
  }, [searchValue])

  return(
    <div className="main-navbar__search w-100 d-none d-md-flex d-lg-flex">
      <Form className="main-navbar__search w-100 d-none d-md-flex d-lg-flex">
        <InputGroup seamless className="ml-3">
          <InputGroupAddon type="prepend">
            <InputGroupText>
              <i className="material-icons">search</i>
            </InputGroupText>
          </InputGroupAddon>
          <FormInput
            className="navbar-search"
            placeholder="Search for something..."
            onChange={debounceResults}
          />
          <Button theme="light" onClick={() => setFilterOpen(true)}>
              <i className="material-icons" style={{fontSize: "20px"}}>filter_list</i>
            </Button>
            <Modal open={filterOpen} size="sm" toggle={() => setFilterOpen(!filterOpen)}>
              <ModalHeader>
                Search Filters
              </ModalHeader>
              <ModalBody>
                <FormRadio
                  checked = {filterList.selected === "authors"}
                  onChange={() => setFilterList({selected: "authors"})}
                >
                  Authors
                </FormRadio>
                <FormRadio 
                  checked = {filterList.selected === "posts"}
                  onChange={() => setFilterList({selected: "posts"})}
                >
                  Posts
                </FormRadio>
                <FormRadio 
                  checked = {filterList.selected === "all"}
                  onChange={() => setFilterList({selected: "all"})}
                >
                  All
                </FormRadio>
              </ModalBody>
            </Modal>
        </InputGroup>
      </Form>
      <Collapse open={!!searchValue} className="dropdown-menu" style={{width: "60%"}}>
        {(filterList.selected === "authors" || filterList.selected === "all") && <div>
          <h5 style={{paddingLeft: "5%"}}>Authors</h5>
          {!results.users.length && <p style={{paddingLeft: "5%"}}>Nothing to show...</p>}
          {!!results.users.length && results.users.map((item, idx) => (
            <Link key={idx} to={"/user?id=" + item.id} style={{textDecoration: 'none'}}>
            <DropdownItem style={{paddingLeft: "5%"}} onClick={() => setSearchValue("")}>
                <div key={idx} className="blog-comments__item border-bottom d-flex p-3">
                  <div className="blog-comments__avatar mr-3">
                    {item.authorAvatar && <img className="rounded-circle" src={item.authorAvatar} alt={item.fullName} />}
                    {!item.authorAvatar && <i className="material-icons" style={{fontSize: "3.125rem", verticalAlign: "middle"}}>account_circle</i>}
                  </div>
    
                  <div className="blog-comments__content">

                  <div className="blog-comments__meta text-mutes">
                    {item.fullName}
                  </div>
    
                  <p className="m-0 my-1 mb-2 text-muted">{item.description ? item.description.slice(0, 50).toString() + '...' : '...'}</p>
                </div>
              </div>
            </DropdownItem>
            </Link>
        ))}
        </div>}
        {(filterList.selected === "posts" || filterList.selected === "all") && <div>
          <h5 style={{paddingLeft: "5%"}}>Posts</h5>
          {!results.posts.length && <p style={{paddingLeft: "5%"}}>Nothing to show...</p>}
          {!!results.posts.length && results.posts.map((item, idx) => (
            <Link key={idx} to={"/blog?id=" + item.id + (!item.backgroundImage ? '&ni=' + true : "")} style={{textDecoration: 'none'}}>
              <DropdownItem style={{paddingLeft: "5%"}} onClick={() => setSearchValue("")}>
                <div key={idx} className="blog-comments__item border-bottom d-flex p-3">
                  {<div className="blog-comments__avatar mr-3">
                    <img src={item.backgroundImage ? item.backgroundImage : null} alt={item.backgroundImage ? item.title.substring(0, 5) : null} />
                  </div>}

                <div className="blog-comments__content">
                <div className="blog-comments__meta text-mutes">
                  {item.title}
                </div>

                <p className="m-0 my-1 mb-2 text-muted">{item.body.slice(0, 50).toString().replace(/<\/?[^>]+(>|$)/g, "") + '...'}</p>
                </div>
              </div>
            </DropdownItem>
            </Link>
        ))}
        </div>}
      </Collapse>
    </div>
  )
}

export default NavbarSearch;