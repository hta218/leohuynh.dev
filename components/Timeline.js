import timelineData from '@/data/timelineData'

const TimelineItem = ({ time, role, company, companyURL, companyBio, works }) => {
  return (
    <li className="relative ml-2.5 !my-0 pl-5 pb-6 border-l border-[#abaaed]">
      <div className="font-semibold leading-[18px] mb-4">{time}</div>
      <div>
        {role}{' '}
        {company ? (
          <>
            at{' '}
            <a target="_blank" rel="noopener noreferrer" href={companyURL}>
              {company}
            </a>
          </>
        ) : null}
        {companyBio ? ` - ${companyBio}` : null}
        {works ? (
          <div className="block my-2">
            <div className="mb-2">Key-works:</div>
            <div className="pl-2">
              {works.map((work, ind) => (
                <div key={ind}>- {work}</div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </li>
  )
}

const Timeline = () => {
  return (
    <div className="timeline">
      <ul>
        {timelineData.map((item) => (
          <TimelineItem key={item.time} {...item} />
        ))}
      </ul>
    </div>
  )
}

export default Timeline
