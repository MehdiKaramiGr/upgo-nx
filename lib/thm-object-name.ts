const thmObjectName = (userId: string, fileId: string) => {
  return `thumbs/${userId}/${fileId}-thm.webp`;
};

export default thmObjectName;
