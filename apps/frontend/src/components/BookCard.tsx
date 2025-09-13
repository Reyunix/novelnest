import type { BookItem } from "../interfaces/interfaces"

interface Props {
    bookItem: BookItem
}
export const BookCard:React.FC<Props> = ({bookItem}) => {
    const book = bookItem.volumeInfo
  return (
    
    <div className="book-card">
        <h3>{book?.title}</h3>
        <p>{book?.authors}</p>
        <img src={book?.imageLinks?.smallThumbnail} alt="" />
        <p>{book?.categories}</p>
        <p>{book?.publisher}</p>
        {book?.publishedDate && <p>{book.publishedDate.toString()}</p>}
        <p>{book?.pageCount}</p>

    </div>
  )
}
