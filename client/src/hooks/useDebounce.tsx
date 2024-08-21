import React, { useEffect, useState } from 'react'
// new_ sử dụng kỹ thuật debounce để giảm tải tìm kiếm lên api
function useDebounceCustom({ inputValue, delay }: { inputValue: string, delay: number }) {
    const [deBounce, setDeBounce] = useState(inputValue)
    useEffect(() => {
        const handler = setTimeout(() => {
            setDeBounce(inputValue)
        }, delay)

        // tránh trường hợp rò ri, tràn bộ nhớ
        return () => {
            clearTimeout(handler)
        }

    }, [inputValue, delay])

    // giá trị tả về là giá trị input sau khi được debounce
    return deBounce
}

export default useDebounceCustom