import React, {useState, useEffect} from "react";
import {
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
  Button,
  InputGroup,
  InputGroupAddon,
  FormCheckbox,
  FormInput
} from "shards-react";
import { AddPostStore } from "../../flux";

const SidebarCategories = ({post, setPost }) => {
  const title = "Categories"

  const [checked, setChecked] = useState(AddPostStore.getPost().category)
  const [uncateg, setUncateg] = useState(true)
  const [newCateg, setNewCateg] = useState('')

  const Category = ({value}) => {
    return(
      <FormCheckbox className="mb-1" value={value} checked={checked[value]} onChange={()=> onChangeCheck(value)} >
          {value.charAt(0).toUpperCase() + value.slice(1)}
      </FormCheckbox>
    )
  }

  useEffect(() => {
    AddPostStore.addChangeListener(setDetails)
    let uncateg = true
    for(const cat in checked) {
      if(checked[cat]){
        uncateg = false
        break
      }
    }
    setUncateg(uncateg)
    setPost({...post, category: checked})

    return () => AddPostStore.removeChangeListener(setDetails)
  }, [checked])

  const setDetails = () => {
    setChecked(AddPostStore.getPost().category)
  }
  
  const onChangeCheck = (categ) => {
    const check = {}
    for (const cat in checked){
      if(cat === categ) {
        check[categ] = !checked[categ]
        continue
      }
      check[cat] = false
    }
    
    setChecked({...checked, ...check})
  }

  const onClickAddCateg = (event) => {
    if(!newCateg) {
      return null
    }
    setChecked({...checked, [newCateg.toLowerCase()]: false})
    setNewCateg('')
  }
  
  return(
    <Card small className="mb-3">
    <CardHeader className="border-bottom">
      <h6 className="m-0">{title}</h6>
    </CardHeader>
    <CardBody className="p-0">
      <ListGroup flush>
        <ListGroupItem className="px-3 pb-2">
          <FormCheckbox className="mb-1" value="uncategorized" checked={uncateg} disabled>
            Uncategorized
          </FormCheckbox>
          {Object.getOwnPropertyNames(checked).map((item, i) => {
            return <Category 
              key = {i}
              value = {item} />
          })}
        </ListGroupItem>

        <ListGroupItem className="d-flex px-3">
          <InputGroup className="ml-auto">
            <FormInput placeholder="New category" value={newCateg} onChange ={event => setNewCateg(event.target.value)}/>
            <InputGroupAddon type="append">
              <Button theme="white" className="px-2" onClick={onClickAddCateg}>
                <i className="material-icons">add</i>
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </ListGroupItem>
      </ListGroup>
    </CardBody>
  </Card>
  )
};

export default SidebarCategories;
