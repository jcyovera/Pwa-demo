import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Book } from '../models/book.model';

@Injectable()
export class BookService {
  booksApiUrl = 'https://www.googleapis.com/books/v1/volumes';
  bestSellersApiUrl = 'https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json';
  constructor(private http: Http) { }

  private replaceHttpsInProps(book: Book): Book {
    const propsToModify = ['thumbnail', 'smallThumbnail', 'medium'];
    propsToModify.forEach((prop) => {
      if (book.volumeInfo && book.volumeInfo.imageLinks) {
        if (book.volumeInfo.imageLinks[prop]) {
          book.volumeInfo.imageLinks[prop] = book.volumeInfo.imageLinks[prop].replace('http://', 'https://');
        }
      }
    })
    return book;
  }
  searchBooks(query: string): Observable<any> {
    return this.http.get(`${this.booksApiUrl}/?q=${query}`)
      .map((res: any) => {
        res = res.json();
        return res.items.map(this.replaceHttpsInProps)
      });
  }

  getBookById(id: string): Observable<any> {
    return this.http.get(`${this.booksApiUrl}/${id}`)
      .map((resp) => {
        const book = resp.json()
        return this.replaceHttpsInProps(book);
      });
  }
  getBestSellersFromNYT(): Observable<any> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('api-key', '112cc281f201470b811aac69ed0cc809');
    return this.http.get(`${this.bestSellersApiUrl}`, { search: params })
      .map((resp) => {
        const book = resp.json()
        return this.replaceHttpsInProps(book);
      });
  }
  searchBestSellersByIsbn(isbn: string): Observable<any> {
    return this.http.get(`${this.booksApiUrl}/?q=''+isbn=${isbn}`)
      .map((res: any) => {
        res = res.json();
        return res.items.map(this.replaceHttpsInProps)
      });
  }
}
