import { FC } from "react";

interface ContactCardProps {
  phone: string;
  email: string;
  address: string;
}

const ContactDetailsCard: FC<ContactCardProps> = ({ phone, email, address }) => {
  return (
    <div className="bg-white shadow  p-3">
      <p className=" font-semibold ">Contact</p>
      <div className="space-y-1">
        <p>
          <span className="font-small text-sm">Phone:{phone}</span> 
        </p>
        <p>
          <span className="font-small text-sm">Email: {email}</span> 
        </p>
        <p>
          <span className="font-small text-sm">Address: {address}</span>
        </p>
      </div>
    </div>
  );
};

export default ContactDetailsCard;
