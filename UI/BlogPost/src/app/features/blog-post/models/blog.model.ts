export interface Blog {
    id: string;
    name: string;
    title: string;
    shortDescription: string;
    content: string;
    featuredImageUrl: string;
    publishedDate: string | Date;
    author: string;
    isVisible: boolean;
}

export interface CreateBlogRequest {
    name: string;
    title: string;
    shortDescription: string;
    content: string;
    featuredImageUrl: string;
    publishedDate: string | Date;
    author: string;
    isVisible: boolean;
}

export interface UpdateBlogRequest {
    name: string;
    title: string;
    shortDescription: string;
    content: string;
    featuredImageUrl: string;
    publishedDate: string | Date;
    author: string;
    isVisible: boolean;
}

