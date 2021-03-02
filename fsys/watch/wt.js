
// watch : event type
/* the following are legal, implemented events that user-space can watch for */
// #define in "inotify.h" 
const watch = {};
/* the following are legal, implemented events that user-space can watch for */
watch.IN_ACCESS = 0x00000001;	/* File was accessed */
watch.IN_MODIFY = 0x00000002;	/* File was modified */
watch.IN_ATTRIB = 0x00000004;	/* Metadata changed */
watch.IN_CLOSE_WRITE = 0x00000008;	/* Writtable file was closed */
watch.IN_CLOSE_NOWRITE = 0x00000010;	/* Unwrittable file closed */
watch.IN_OPEN = 0x00000020;	/* File was opened */
watch.IN_MOVED_FROM = 0x00000040;	/* File was moved from X */
watch.IN_MOVED_TO = 0x00000080;	/* File was moved to Y */
watch.IN_CREATE = 0x00000100;	/* Subfile was created */
watch.IN_DELETE = 0x00000200;	/* Subfile was deleted */
watch.IN_DELETE_SELF = 0x00000400;	/* Self was deleted */
watch.IN_MOVE_SELF = 0x00000800;	/* Self was moved */

/* the following are legal events.  they are sent as needed to any watch */
watch.IN_UNMOUNT = 0x00002000;	/* Backing fs was unmounted */
watch.IN_Q_OVERFLOW = 0x00004000;	/* Event queued overflowed */
watch.IN_IGNORED = 0x00008000;	/* File was ignored */

/* helper events */
watch.IN_CLOSE = (watch.IN_CLOSE_WRITE | watch.IN_CLOSE_NOWRITE); /* close */
watch.IN_MOVE = (watch.IN_MOVED_FROM | watch.IN_MOVED_TO); /* moves */

/* special flags */
watch.IN_ONLYDIR = 0x01000000;	/* only watch the path if it is a directory */
watch.IN_DONT_FOLLOW = 0x02000000;	/* don't follow a sym link */
watch.IN_EXCL_UNLINK = 0x04000000;	/* exclude events on unlinked objects */
watch.IN_MASK_CREATE = 0x10000000;	/* only create watches */
watch.IN_MASK_ADD = 0x20000000;	/* add to the mask of an already existing watch */
watch.IN_ISDIR = 0x40000000;	/* event occurred against dir */
watch.IN_ONESHOT = 0x80000000;	/* only send event once */


watch.IN_ALL_EVENTS = (watch.IN_ACCESS | watch.IN_MODIFY | watch.IN_ATTRIB | watch.IN_CLOSE_WRITE |
  watch.IN_CLOSE_NOWRITE | watch.IN_OPEN | watch.IN_MOVED_FROM |
  watch.IN_MOVED_TO | watch.IN_DELETE | watch.IN_CREATE | watch.IN_DELETE_SELF |
  watch.IN_MOVE_SELF);

export const wt = watch;