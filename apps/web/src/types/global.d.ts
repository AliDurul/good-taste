interface IPageSearchParams { searchParams: Promise<{ [key: string]: string | undefined }> }

interface IPageParams { params: Promise<{ slug: string }> }