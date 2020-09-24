import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
    private posts: Post [] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient, private router: Router) {}

    // tslint:disable-next-line: typedef
    getPosts() {
        this.http
        .get<{ message: string, posts: any }>(
            'http://localhost:3000/api/posts'
        )
        .pipe(map((postData) => {
            return postData.posts.map(post => {
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id,
                    imagePath: post.imagePath,
                    creator: post.creator,
                    creationDate: post.creationDate
                };
            });
        }))
        .subscribe((transformedPosts) => {
            this.posts = transformedPosts;
            this.postsUpdated.next([...this.posts]);
        });
    }

    // tslint:disable-next-line: typedef
    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }


    // tslint:disable-next-line: typedef
    getPost(id: string) {
        return this.http.get<{
            _id: string,
            title: string,
            content: string,
            imagePath: string,
            creator: string,
            creationDate: string
        }>('http://localhost:3000/api/posts/' + id);
    }

    // tslint:disable-next-line: typedef
    addPost(title: string, content: string, image: File, creationDate: string) {
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);
        postData.append('creationDate', creationDate);
        this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
        .subscribe(responseData => {
            // const post: Post = {
            //     id: responseData.post.id,
            //     title,
            //     content,
            //     imagePath: responseData.post.imagePath,
            //     creator: null,
            //     creationDate
            // };
            // this.posts.push(post);
            // this.postsUpdated.next([...this.posts]);
            this.router.navigate(['/posts']);
        });
    }

    // tslint:disable-next-line: typedef
    updatePost(id: string, title: string, content: string, image: File | string, creationDate: string) {
        let postData: Post | FormData;
        if (typeof image === 'object') {
            postData = new FormData();
            postData.append('id', id);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image, title);
            postData.append('creationDate', creationDate);
        } else {
            postData = {
                id,
                title,
                content,
                imagePath: image,
                creator: null,
                creationDate
            };
        }
        this.http.put('http://localhost:3000/api/posts/' + id, postData)
        .subscribe(response => {
            // const updatedPosts = [...this.posts];
            // const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
            // const post: Post = {
            //     id,
            //     title,
            //     content,
            //     imagePath: '',
            //     creator: null,
            //     creationDate
            // };
            // updatedPosts[oldPostIndex] = post;
            // this.posts = updatedPosts;
            // this.postsUpdated.next([...this.posts]);
            this.router.navigate(['/posts']);
        });
    }

    // tslint:disable-next-line: typedef
    deletePost(postId: string) {
        return this.http.delete('http://localhost:3000/api/posts/' + postId);
        // .subscribe(() => {
        //     const updatedPosts = this.posts.filter(post => post.id !== postId);
        //     this.posts = updatedPosts;
        //     this.postsUpdated.next([...this.posts]);
        // });
    }
}
