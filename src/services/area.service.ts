import Area from "../models/area";
import HttpException from "../exceptions/error";

class AreaService {
  constructor(){
  }

  public createArea = async (name: string, userId: string) =>  {
    const area = new Area({
      name: name,
      owner: userId
    })
    await area.save();

    return area;
  }

  public getAreaById = async (areaId: string, userId: string) => {
    const area = await Area.findOne({ _id: areaId, owner: userId });

    if (!area){
      throw new HttpException(404, 'Unable to find area');
    }

    return area;
  }

  public updateArea = async (updatedArea: any, areaId: string, userId: string) => {
    const updates = Object.keys(updatedArea);
    const allowedUpdates = ['name'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation){
      throw new HttpException(405, "Invalid updates");
    }
  
    const area = await Area.findOne({ _id: areaId, owner: userId });

    if (!area){
      throw new HttpException(404, 'Unable to find area');
    }

    updates.forEach((update) => area[update] = updatedArea[update]);

    await area.save();

    return area;
  }

  public deleteArea = async (areaId: string, userId: string) => {
    const area = await Area.findOne({ _id: areaId, owner: userId });

    if (!area){
      throw new HttpException(404, 'Unable to find area');
    }

    area.deleteOne();
  }
}

export default AreaService;
