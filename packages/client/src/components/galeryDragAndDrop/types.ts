export interface GalaryDragAndDropProps {
  galaryImages: string[];
  setGalaryImages: React.Dispatch<React.SetStateAction<string[]>>;
  handleImageRemove: (index: number, src: string) => void;
}
export interface ImageCardProps {
  src: string;
  index: number;
  moveImage: (dragIndex: number, hoverIndex: number) => void;
  handleImageRemove: (index: number, src: string) => void;
}
