import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Col, Flex, Input, Row, Space } from 'antd'
import clsx from 'clsx'
import style from './header.module.css'
import { BsChevronLeft } from 'react-icons/bs'

import { TiDelete } from 'react-icons/ti'
import { useAppDispatch, useAppSelector } from '../../store'
import { getAllProductSearch, hasList } from '../../slices/productSlice'
import { getAllTag } from '../../slices/tagSlice'
import { getAllBrand } from '../../slices/brandSlice'
import { getAllCategory } from '../../slices/categorySlice'
import { RiSearchLine } from 'react-icons/ri'
import useDebounceCustom from '../../hooks/useDebounce'

function HeaderScreenMobile() {
  // hiển thị danh sách tìm kiém
  // tìm kiếm
  const [search, setSearch] = useState<string>('')

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { categories } = useAppSelector((state) => state.categories)
  const { brands } = useAppSelector((state) => state.brands)
  const { tags } = useAppSelector((state) => state.tags)

  // khi search thay đổi thì debouncedSearchItem sẽ được gọi
  const debouncedSearchItem = useDebounceCustom({
    inputValue: search,
    delay: 400
  })
  useEffect(() => {
    if (debouncedSearchItem) {
      dispatch(getAllProductSearch({ search: debouncedSearchItem }))
    }
  }, [debouncedSearchItem, dispatch])

  const handleSearch = (e: any) => {
    setSearch(e.target.value)
    if (e.target.value === '') {
      dispatch(hasList({ isList: false }))
    } else {
      dispatch(hasList({ isList: true }))
      // dispatch(getAllProductSearch({ search: e.target.value }));
    }
  }

  // search
  const handleSearchTag = (e: string) => {
    localStorage.setItem('filter', JSON.stringify({ searchTag: e }))
  }

  useEffect(() => {
    if (tags.length === 0) dispatch(getAllTag())
    if (brands.length === 0) dispatch(getAllBrand())
    if (categories.length === 0) dispatch(getAllCategory())
  }, [])

  return (
    // 5 16 0 3
    <>
      <div
        style={{
          background: '#256cdf',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Row justify="end" className={clsx(style.wrapper_try)}>
          <Col span={24}>
            <Row>
              <Col
                style={{
                  transition: '.3s linear'
                }}
                span={24}
              >
                <Row style={{ display: 'flex', alignItems: 'center' }}>
                  <Col xs={2} sm={0}>
                    <Space>
                      <BsChevronLeft
                        onClick={() => navigate(-1)}
                        className={clsx(style.button_icon)}
                      />
                    </Space>
                  </Col>
                  <Col xs={22} sm={0}>
                    <Flex>
                      <Input
                        autoFocus
                        type="text"
                        value={search}
                        onInput={handleSearch}
                        className={clsx(style.header_search_input)}
                        placeholder="Tìm kiếm sản phẩm "
                        // onFocus={handleSearch}
                      ></Input>

                      <div className={clsx(style.header_search_icon_search)}>
                        <RiSearchLine />
                      </div>

                      <div
                        onClick={() => {
                          setSearch('')
                        }}
                        className={clsx(style.header_search_icon_delete)}
                      >
                        {search ? <TiDelete /> : <></>}
                      </div>
                    </Flex>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      {/* tag */}
      <div
        style={{
          background: '#256cdf',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Row
          style={{ paddingTop: '0px', zIndex: 1 }}
          justify="end"
          className={clsx(style.wrapper_try, style.wrapper_try_tag)}
        >
          <Col xs={0} sm={2} md={2} lg={5}></Col>
          <Col xs={0} sm={14} md={13} lg={13} className={clsx(style.wrapper_try_tag)}>
            <Flex className={clsx(style.wrapper_try_tag_display)}>
              {tags &&
                tags.map((tag, index) => (
                  <Link
                    key={index}
                    onClick={() => handleSearchTag(tag._id)}
                    className={clsx(style.tag_item)}
                    to={`/timkiem?t=${tag.name}`}
                  >
                    {tag.name}
                  </Link>
                ))}
            </Flex>
          </Col>
          <Col xs={0} sm={8} md={9} lg={6}></Col>
          <Col xs={0} sm={0}></Col>
        </Row>
      </div>
    </>
  )
}

export default HeaderScreenMobile
