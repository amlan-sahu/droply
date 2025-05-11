import {pgTable, text, uuid, integer, boolean , timestamp} from "drizzle-orm/pg-core"
import {relations} from "drizzle-orm"


export const files =pgTable("files", {
    id: uuid("id").defaultRandom().primaryKey(),

    //basic file/folder info
    name: text("name").notNull(), // file name
    path: text("path").notNull(), // file path /project/documents/abc.txt
    size: integer("size").notNull(), // file size in bytes
    type: text("type").notNull(), // file type (e.g. "file", "folder")

    //storage info
    fileUrl: text("file_url").notNull(), // file url to acess file (e.g. "https://example.com/file.txt")
    thumbnailUrl: text("thumbnail_url"), // file url to acess thumbnail (e.g. "https://example.com/file.jpg")

    //ownership info
    userId: text("user_id").notNull(), // user id of the file owner
    parentId: uuid("parent_id"),// parent folder id (null if root folder)

    // file/folder flags

    isFolder: boolean("is_folder").notNull().default(false), // is this a folder?
    isStarred: boolean("is_starred").notNull().default(false), // is this file starred?
    isTrash: boolean("is_trash").notNull().default(false), // is this file in trash?

    // timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(), // file creation timestamp
    updatedAt: timestamp("updated_at").defaultNow().notNull(), // file update timestamp

})

/*
parent: Each file/folder can have one parent folder (null if root folder)
children: Each file/folder can have many child files/folders (e.g. a folder can have many files and subfolders)
*/

export const filesRelations = relations(files, ({one, many}) => ({
    parent: one(files, {
        fields: [files.parentId], 
        references: [files.id]
    }),

    //relationship to child file/folder
    children: many(files),
}))

//Type defination

export const File = typeof files.$inferSelect;
export const NewFile = typeof files.$inferInsert;
