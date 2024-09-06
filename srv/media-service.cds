using { sumanth.media as db } from '../db/data-model';

service Attachments {
    entity Book as projection on db.Book;
    entity Files as projection on db.Files

}
